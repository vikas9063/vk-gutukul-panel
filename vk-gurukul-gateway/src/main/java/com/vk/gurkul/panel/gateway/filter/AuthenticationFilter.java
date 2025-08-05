package com.vk.gurkul.panel.gateway.filter;

import java.util.List;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import com.vk.gurkul.panel.gateway.util.JsonResponse;
import com.vk.gurkul.panel.gateway.util.JwtUtil;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class AuthenticationFilter implements GlobalFilter, Ordered {

    private final JwtUtil jwtUtil;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getPath().value();

        if (path.startsWith("/api/v1/auth") || path.startsWith("/api/v1/public")) {
        	System.out.println("Exit From Here");
            return chain.filter(exchange);
        }

        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return unauthorized(exchange, "Un Authorized");
        }

        String token = authHeader.substring(7);
        try {
            String userId = jwtUtil.extractUserId(token);
            List<String> authorities = jwtUtil.extractAuthorities(token);

            ServerHttpRequest mutated = exchange.getRequest().mutate()
                    .header("X-User-Id", userId != null ? userId : "")
                    .header("X-Authorities", String.join(",", authorities))
                    .build();

            return chain.filter(exchange.mutate().request(mutated).build());

        } catch (JwtException | IllegalArgumentException e) {
        	if(e instanceof ExpiredJwtException) {
        		return unauthorized(exchange, "Token Expired");
        	}
            return unauthorized(exchange, "Un Authorized");
        }
    }

    private Mono<Void> unauthorized(ServerWebExchange exchange, String message) {
        return JsonResponse.writeJsonError(exchange, HttpStatus.UNAUTHORIZED, message);
    }

    @Override
    public int getOrder() {
        return -1; 
    }
}
