//package com.vk.gurkul.panel.gateway.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
//import org.springframework.security.config.web.server.ServerHttpSecurity;
//import org.springframework.security.web.server.SecurityWebFilterChain;
//
//@Configuration
//@EnableWebFluxSecurity
//public class SecurityConfig {
//
//	@Bean
//	SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
//		return http.csrf(ServerHttpSecurity.CsrfSpec::disable)
//				.authorizeExchange(ex -> ex.pathMatchers("/api/v1/auth/**", "/api/v1/public/**", "/actuator/health")
//						.permitAll().anyExchange().permitAll())
//				.build();
//	}
//}