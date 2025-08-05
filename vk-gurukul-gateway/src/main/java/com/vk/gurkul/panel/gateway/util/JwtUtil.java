package com.vk.gurkul.panel.gateway.util;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

/**
 * Lightweight JWT helper used by the Gateway only to validate and extract claims.
 * Assumes an HMAC secret (Base64-encoded). For RSA, change getSignKey() accordingly.
 */
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    /** Subject is treated as the userId/email depending on issuer convention. */
    public String extractUserId(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /** Expiration claim. */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extract list of granted authorities/permissions from the token's "authorities" claim.
     * Adjust the claim name if your auth service uses "roles" or something else.
     */
    public List<String> extractAuthorities(String token) {
        Claims claims = extractAllClaims(token);
        Object authoritiesObj = claims.get("authorities");
        if (authoritiesObj instanceof List<?> list) {
            return list.stream().map(Object::toString).collect(Collectors.toList());
        }
        return Collections.emptyList();
    }

    /**
     * Generic claim extractor wrapper. Throws JwtException subclasses on invalid/expired token.
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = extractAllClaims(token); // will throw if invalid/expired
        return claimsResolver.apply(claims);
    }

    /**
     * Parse & validate signature; throws JwtException if invalid or expired.
     */
    private Claims extractAllClaims(String token) throws JwtException {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Decode Base64 secret into HMAC key. Your property must be Base64-encoded.
     * If you instead store raw text secret, use getBytes(StandardCharsets.UTF_8) directly.
     */
    private Key getSignKey() {
        byte[] keyBytes;
        try {
            keyBytes = Decoders.BASE64.decode(secret);
        } catch (IllegalArgumentException e) {
            keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
