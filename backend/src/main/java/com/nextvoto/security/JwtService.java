package com.nextvoto.security;

import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.nextvoto.entity.Usuario;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public Date extractExpiration(String token) {
        return extractAllClaims(token).getExpiration();
    }

    public String generateToken(Usuario usuario) {
        return Jwts.builder()
                .claim("idUsuario", usuario.getIdUsuario().toString())
                .claim("rol", usuario.getRol().getNombre())
                .claim("nombre", usuario.getNombre())
                .subject(usuario.getEmail())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSignInKey())
                .compact();
    }

    boolean correspondeA(Claims claims, Usuario usuario) {
        String idUsuario = claims.get("idUsuario", String.class);
        if (idUsuario != null) {
            return idUsuario.equals(usuario.getIdUsuario().toString());
        }
        return !claims.getIssuedAt().toInstant().isBefore(usuario.getCreadoEn()
                .atZone(ZoneId.systemDefault()).toInstant().truncatedTo(ChronoUnit.SECONDS));
    }

    Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
