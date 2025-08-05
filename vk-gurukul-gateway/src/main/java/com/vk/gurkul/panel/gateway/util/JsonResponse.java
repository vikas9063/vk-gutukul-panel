package com.vk.gurkul.panel.gateway.util;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.server.ServerWebExchange;

import com.fasterxml.jackson.databind.ObjectMapper;

import reactor.core.publisher.Mono;

public class JsonResponse {
	// Reuse a single ObjectMapper (thread-safe after configuration)
	private static final ObjectMapper mapper = new ObjectMapper();

	public static Mono<Void> writeJsonError(ServerWebExchange exchange, HttpStatus status, String message) {
		exchange.getResponse().setStatusCode(status);
		exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);

		Map<String, Object> body = new HashMap<>();
		body.put("status", "Error");
		body.put("message", message);
		body.put("result", null);

		byte[] bytes;
		try {
			bytes = mapper.writeValueAsBytes(body);
		} catch (Exception e) {
			// Fallback minimal JSON
			bytes = ("{\"status\":\"Error\",\"message\":\"Serialization error\",\"result\":null}")
					.getBytes(StandardCharsets.UTF_8);
		}

		DataBufferFactory bufferFactory = exchange.getResponse().bufferFactory();
		DataBuffer buffer = bufferFactory.wrap(bytes);
		return exchange.getResponse().writeWith(Mono.just(buffer));
	}
}
