package com.nextvoto.service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

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

    @Value("${callmebot.api.url}")
    private String callMeBotUrl;

    @Value("${callmebot.api.key}")
    private String callMeBotApiKey;

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
        String texto = "Hola " + nombreUsuario + ", tu código de recuperación de NextVoto es: *" + pin + "*. Válido por 15 minutos.";
        enviarWhatsApp(telefonoDestino, texto);
    }

    public void enviarWhatsApp(String telefonoDestino, String mensaje) {
        if (telefonoDestino == null || telefonoDestino.isBlank()) {
            throw new BusinessException("El usuario no tiene un número de teléfono registrado.");
        }

        try {
            String numeroFormateado = formatearWhatsAppMexico(telefonoDestino);
            String mensajeCodificado = URLEncoder.encode(mensaje, StandardCharsets.UTF_8);

            String endpoint = String.format(
                "%s?phone=%s&text=%s&apikey=%s",
                callMeBotUrl,
                numeroFormateado,
                mensajeCodificado,
                callMeBotApiKey
            );

            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(endpoint))
                .GET()
                .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200 || (response.body() != null && response.body().contains("ERROR"))) {
                log.error("Respuesta de error de CallMeBot ({}): {}", response.statusCode(), response.body());
                throw new BusinessException("No se pudo entregar el mensaje de WhatsApp mediante CallMeBot.");
            }
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error enviando WhatsApp a {}: {}", telefonoDestino, e.getMessage());
            throw new BusinessException("No se pudo enviar el mensaje de WhatsApp. Verifica que el número esté activado en CallMeBot.");
        }
    }

    // CallMeBot requiere 521 + 10 dígitos (sin signo +) para celulares de México
    private String formatearWhatsAppMexico(String telefono) {
        String digitos = telefono.replaceAll("[^0-9]", "");
        if (digitos.startsWith("521") && digitos.length() == 13) {
            return digitos;
        }
        if (digitos.startsWith("52") && digitos.length() == 12) {
            return "521" + digitos.substring(2);
        }
        if (digitos.length() == 10) {
            return "521" + digitos;
        }
        return digitos;
    }
}