package com.a508.wms.auth.config;

import com.a508.wms.auth.provider.JwtProvider;
import com.a508.wms.user.domain.User;
import com.a508.wms.user.repository.UserRepository;
import com.a508.wms.auth.dto.response.auth.SignInResponseDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.util.Optional;

@Component
public class CustomSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;

    public CustomSuccessHandler(JwtProvider jwtProvider, UserRepository userRepository) {
        this.jwtProvider = jwtProvider;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        // 인증된 사용자의 이메일을 가져옴
        String email = authentication.getName();

        // 이메일을 통해 사용자 조회
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (!userOptional.isPresent()) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not found");
            return;
        }

        User user = userOptional.get();

        // JWT 생성
        String token = jwtProvider.create(email);

        // SignInResponseDto 생성
        ResponseEntity<SignInResponseDto> responseEntity = SignInResponseDto.success(token, user);

        // JSON 응답을 문자열로 변환하여 URL 쿼리 매개변수로 포함
        String jsonResponse = responseEntity.getBody().toJsonString();

        // 리다이렉트할 URL
        String redirectUrl = "https://i11a508.p.ssafy.io/sociallogin";

        // 리다이렉트 수행
        response.sendRedirect(redirectUrl + "?response=" + jsonResponse);
    }
}
