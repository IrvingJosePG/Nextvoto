package com.nextvoto.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nextvoto.entity.Token;
import com.nextvoto.entity.Usuario;
import com.nextvoto.entity.Token.TipoToken;

public interface TokenRepository extends JpaRepository<Token, Long> {
    boolean existsByTokenAndTipo(String token, TipoToken tipo);
    void deleteByUsuarioAndTipo(Usuario usuario, TipoToken tipo);
    Optional<Token> findByTokenAndTipoAndExpiracionAfter(String token, TipoToken tipo, LocalDateTime ahora);
}