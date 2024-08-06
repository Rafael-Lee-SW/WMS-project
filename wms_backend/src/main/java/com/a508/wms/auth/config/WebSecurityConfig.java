package com.a508.wms.auth.config;

import com.a508.wms.auth.common.ResponseCode;
import com.a508.wms.auth.common.ResponseMessage;
import com.a508.wms.auth.filter.JwtAuthenticationFilter;
import com.a508.wms.auth.handler.ValidationExceptionHandler;
import com.a508.wms.auth.provider.JwtProvider;
import com.a508.wms.user.domain.User;
import com.a508.wms.user.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.a508.wms.user.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.annotation.web.configurers.HttpBasicConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final DefaultOAuth2UserService oAuth2UserService;
    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;

    @Bean
    protected SecurityFilterChain configure(HttpSecurity httpSecurity,
        ValidationExceptionHandler validationExceptionHandler, UserService userService) throws Exception {

        httpSecurity
            .cors(cors -> cors
                .configurationSource(corsConfigurationSource())
            )
            .csrf(CsrfConfigurer::disable)
            .httpBasic(HttpBasicConfigurer::disable)
            .sessionManagement(sessionManagement -> sessionManagement
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(request -> request
                .requestMatchers("/api/v1/auth/**", "/oauth2/**").permitAll()
                .requestMatchers("/oauth2/authorization/**").permitAll()
                .requestMatchers("/api/v1/social/**").authenticated()
                .anyRequest().permitAll()
            )
            .oauth2Login(oauth2 -> oauth2
                .redirectionEndpoint(endpoint -> endpoint.baseUri("/oauth2/code/*"))
                .userInfoEndpoint(endPoint -> endPoint.userService(oAuth2UserService))
                .successHandler(customSuccessHandler())  // 성공 핸들러 설정
            )
            .exceptionHandling(exceptionHandling -> exceptionHandling
                .authenticationEntryPoint(new FailedAuthenticationEntryPoint())
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return httpSecurity.build();
    }

    @Bean
    protected CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("*");
        configuration.addAllowedHeader("*");
        configuration.addAllowedMethod("*");
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public AuthenticationSuccessHandler customSuccessHandler() {
        return (request, response, authentication) -> {
            // 인증된 사용자 정보 가져오기
            String email = authentication.getName();
            User user = userRepository.findByEmail(email).orElseThrow();

            // JWT 생성
            String token = jwtProvider.create(String.valueOf(user.getId()));

            // JSON 응답 생성
            Map<String, Object> body = new HashMap<>();
            body.put("code", ResponseCode.SUCCESS);
            body.put("message", ResponseMessage.SUCCESS);
            body.put("token", token);
            body.put("expirationTime", 3600); // 만료 시간 설정 (예: 3600초)

            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("email", user.getEmail());
            userMap.put("name", user.getName());
            userMap.put("nickname", user.getNickname());
            userMap.put("roleTypeEnum", user.getRoleTypeEnum().name());
            userMap.put("loginTypeEnum", user.getLoginTypeEnum().name());
            userMap.put("statusEnum", user.getStatusEnum().name());
            userMap.put("business", user.getBusiness());

            body.put("user", userMap);

            // JSON 응답 전송
            response.setContentType("application/json");
            response.setStatus(HttpServletResponse.SC_OK);
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.writeValue(response.getWriter(), body);
        };
    }
}

/**
 * 인증 실패 시 처리할 클래스입니다.
 */
class FailedAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
        AuthenticationException authException) throws IOException, ServletException {
        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.getWriter().write("{\"code\":\"" + ResponseCode.SIGN_IN_FAIL + "\" , \"message\":\"" + ResponseMessage.SIGN_IN_FAIL + "\"}");
    }
}
