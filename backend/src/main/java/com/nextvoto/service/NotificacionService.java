package com.nextvoto.service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.nextvoto.exception.BusinessException;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificacionService {

    private final JavaMailSender mailSender;
    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Value("${spring.mail.username}")
    private String mailFrom;

    @Value("${smsgate.api.url}")
    private String smsGateApiUrl;

    @Value("${smsgate.username}")
    private String smsGateUsername;

    @Value("${smsgate.password}")
    private String smsGatePassword;

    public void enviarPinCorreo(String emailDestino, String nombreUsuario, String pin) {
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");

            helper.setFrom(mailFrom);
            helper.setTo(emailDestino);
            helper.setSubject("NextVoto - Código de recuperación de cuenta");

            String html = """
                <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
                    <h2 style="color: #1d4ed8; margin-bottom: 8px;">Recuperación de contraseña</h2>
                    <p style="color: #334155;">Hola <strong>%s</strong>,</p>
                    <p style="color: #334155;">Usa el siguiente código temporal para restablecer tu contraseña en NextVoto (expira en 15 minutos):</p>
                    <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 16px; text-align: center; margin: 20px 0;">
                        <span style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #1e40af;">%s</span>
                    </div>
                    <p style="font-size: 12px; color: #64748b;">Si no solicitaste este cambio, ignora este mensaje.</p>
                </div>
                """.formatted(nombreUsuario, pin);

            helper.setText(html, true);
            mailSender.send(mensaje);
        } catch (Exception e) {
            log.error("Error enviando correo a {}: {}", emailDestino, e.getMessage());
            throw new BusinessException("No se pudo enviar el correo electrónico. Verifica la configuración SMTP.");
        }
    }

    public void enviarPinWhatsApp(String telefonoDestino, String nombreUsuario, String pin) {
        String texto = "Hola " + nombreUsuario + ", tu codigo de recuperacion de NextVoto es: " + pin + ". Valido por 15 minutos.";
        enviarSms(telefonoDestino, texto);
    }

    public void enviarSms(String telefonoDestino, String mensaje) {
        if (telefonoDestino == null || telefonoDestino.isBlank()) {
            throw new BusinessException("El usuario no tiene un número de teléfono registrado.");
        }

        try {
            String numeroDestino = formatearSmsMexico(telefonoDestino);
            String endpoint = smsGateApiUrl.replaceAll("/+$", "") + "/message";

            String textoSeguro = mensaje
                    .replace("\\", "\\\\")
                    .replace("\"", "\\\"")
                    .replace("\n", "\\n")
                    .replace("\r", "");

            String jsonBody = """
                {
                  "textMessage": {
                    "text": "%s"
                  },
                  "phoneNumbers": ["%s"]
                }
                """.formatted(textoSeguro, numeroDestino);

            String credenciales = smsGateUsername + ":" + smsGatePassword;
            String basicAuth = "Basic " + Base64.getEncoder()
                    .encodeToString(credenciales.getBytes(StandardCharsets.UTF_8));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(endpoint))
                    .header("Authorization", basicAuth)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody, StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                log.error("Error de SMSGate ({}): {}", response.statusCode(), response.body());
                throw new BusinessException("No se pudo entregar el SMS mediante la pasarela móvil.");
            }
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error enviando SMS a {}: {}", telefonoDestino, e.getMessage());
            throw new BusinessException("No se pudo enviar el mensaje SMS.");
        }
    }

    // SMS en México utiliza +52 + 10 dígitos (sin el 1 intermedio de WhatsApp)
    private String formatearSmsMexico(String telefono) {
        String digitos = telefono.replaceAll("[^0-9]", "");
        if (digitos.startsWith("521") && digitos.length() == 13) {
            return "+52" + digitos.substring(3);
        }
        if (digitos.startsWith("52") && digitos.length() == 12) {
            return "+" + digitos;
        }
        if (digitos.length() == 10) {
            return "+52" + digitos;
        }
        return "+" + digitos;
    }
}