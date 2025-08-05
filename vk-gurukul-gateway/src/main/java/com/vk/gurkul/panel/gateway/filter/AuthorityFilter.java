package com.vk.gurkul.panel.gateway.filter;

import java.util.Arrays;
import java.util.Collections;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.server.ServerWebExchange;

import com.vk.gurkul.panel.gateway.util.JsonResponse;

import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Slf4j
@Component
public class AuthorityFilter implements GlobalFilter, Ordered {

    private final AntPathMatcher matcher = new AntPathMatcher();

    // Path pattern -> Required permission
    private final Map<String, String> routePermissions = Map.of(
        "/api/v1/permissions/view-all-roles", "role:view",
        "/api/v1/permissions/view", "permission:view"
    );

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();
        Set<String> userAuthorities = extractAuthorities(exchange, true); // use case-insensitive comparison

        log.info("AuthorityFilter: path = {}, userAuthorities = {}", path, userAuthorities);

        for (Map.Entry<String, String> entry : routePermissions.entrySet()) {
            String pattern = entry.getKey();
            String requiredPermission = entry.getValue();

            if (matcher.match(pattern, path)) {
                log.debug("Path '{}' matches pattern '{}'. Required permission: '{}'", path, pattern, requiredPermission);

                // Check if user has permission
                if (!userAuthorities.contains(requiredPermission.toLowerCase(Locale.ROOT))) {
                    log.warn("Access denied: User does not have required permission '{}'", requiredPermission);
                    exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                    return forbidden(exchange);
                }

                break;
            }
        }

        return chain.filter(exchange);
    }

    private Set<String> extractAuthorities(ServerWebExchange exchange, boolean caseInsensitive) {
        String header = exchange.getRequest().getHeaders().getFirst("X-Authorities");
        if (header == null || header.isBlank()) {
            return Collections.emptySet();
        }
        return Arrays.stream(header.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(s -> caseInsensitive ? s.toLowerCase(Locale.ROOT) : s)
                .collect(Collectors.toSet());
    }
    private Mono<Void> forbidden(ServerWebExchange exchange) {
        return JsonResponse.writeJsonError(exchange, HttpStatus.FORBIDDEN, "You don’t have the required access level");
    }

    @Override
    public int getOrder() {
        return 0;
    }
}
