/*
 * package com.vk.gurkul.panel.users.config;
 * 
 * 
 * 
 * import java.io.IOException;
 * 
 * import org.springframework.beans.factory.annotation.Autowired; import
 * org.springframework.security.authentication.AuthenticationServiceException;
 * import org.springframework.security.authentication.
 * UsernamePasswordAuthenticationToken; import
 * org.springframework.security.core.context.SecurityContextHolder; import
 * org.springframework.security.core.userdetails.UserDetails; import
 * org.springframework.security.web.authentication.
 * WebAuthenticationDetailsSource; import
 * org.springframework.stereotype.Component; import
 * org.springframework.web.filter.OncePerRequestFilter;
 * 
 * import com.vk.gurkul.panel.users.exception.CustomAppException; import
 * com.vk.gurkul.panel.users.service.UserInfoUserDetailsService;
 * 
 * import jakarta.servlet.FilterChain; import jakarta.servlet.ServletException;
 * import jakarta.servlet.http.HttpServletRequest; import
 * jakarta.servlet.http.HttpServletResponse;
 * 
 * @Component public class JwtAuthFilter extends OncePerRequestFilter{
 * 
 * 
 * @Autowired private JWTConfig jwtService;
 * 
 * @Autowired private UserInfoUserDetailsService userDetailsService;
 * 
 * @Autowired private JwtAuthenticationEntryPoint authenticationEntryPoint;
 * 
 * @Override protected void doFilterInternal(HttpServletRequest request,
 * HttpServletResponse response, FilterChain filterChain) throws
 * ServletException, IOException { try { String authHeader =
 * request.getHeader("Authorization"); String token = null; String username =
 * null; if (authHeader != null && authHeader.startsWith("Bearer ")) { token =
 * authHeader.substring(7); username = jwtService.extractUsername(token); }
 * 
 * if (username != null &&
 * SecurityContextHolder.getContext().getAuthentication() == null) { UserDetails
 * userDetails = userDetailsService.loadUserByUsername(username);
 * 
 * if (jwtService.validateToken(token, userDetails)) {
 * UsernamePasswordAuthenticationToken authToken = new
 * UsernamePasswordAuthenticationToken(userDetails, null,
 * userDetails.getAuthorities()); authToken.setDetails(new
 * WebAuthenticationDetailsSource().buildDetails(request));
 * SecurityContextHolder.getContext().setAuthentication(authToken); } }
 * filterChain.doFilter(request, response); } catch (Exception e) { if (e
 * instanceof CustomAppException) { authenticationEntryPoint.commence(request,
 * response, new AuthenticationServiceException(e.getMessage(), e)); } } }
 * 
 * 
 * }
 */