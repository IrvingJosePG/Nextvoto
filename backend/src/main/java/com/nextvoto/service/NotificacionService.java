package com.nextvoto.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.nextvoto.exception.BusinessException;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificacionService {

    private final JavaMailSender mailSender;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${spring.mail.username}")
    private String mailFrom;

    @Value("${twilio.account.sid}")
    private String twilioSid;

    @Value("${twilio.auth.token}")
    private String twilioToken;

    @Value("${twilio.whatsapp.from}")
    private String twilioWhatsappFrom;

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
        try {
            String numeroFormateado = formatearWhatsAppMexico(telefonoDestino);
            String url = "https://api.twilio.com/2010-04-01/Accounts/" + twilioSid + "/Messages.json";

            HttpHeaders headers = new HttpHeaders();
            headers.setBasicAuth(twilioSid, twilioToken);
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("From", twilioWhatsappFrom);
            body.add("To", "whatsapp:" + numeroFormateado);
            body.add("Body", "Hola " + nombreUsuario + ", tu código de recuperación de NextVoto es: *" + pin + "*. Válido por 15 minutos.");

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
            restTemplate.postForEntity(url, request, String.class);
        } catch (Exception e) {
            log.error("Error enviando WhatsApp a {}: {}", telefonoDestino, e.getMessage());
            throw new BusinessException("No se pudo enviar el mensaje de WhatsApp. Verifica que tu número esté unido al Sandbox de Twilio.");
        }
    }

    // Twilio WhatsApp requiere formato +521 + 10 dígitos para números celulares de México
    private String formatearWhatsAppMexico(String telefono) {
        String limpio = telefono.replaceAll("[^0-9+]", "");
        if (limpio.startsWith("+521") && limpio.length() == 14) {
            return limpio;
        }
        if (limpio.startsWith("+52") && limpio.length() == 13) {
            return "+521" + limpio.substring(3);
        }
        if (limpio.length() == 10) {
            return "+521" + limpio;
        }
        return limpio.startsWith("+") ? limpio : "+" + limpio;
    }
}