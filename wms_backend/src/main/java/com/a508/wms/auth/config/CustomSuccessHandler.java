package com.a508.wms.auth.config;

import com.a508.wms.auth.provider.JwtProvider;
import com.a508.wms.user.domain.User;
import com.a508.wms.user.repository.UserRepository;
import com.a508.wms.auth.dto.response.auth.SignInResponseDto;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.net.URLEncoder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mapping.SimpleAssociationHandler;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler  {


    private final JwtProvider jwtProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
        HttpServletResponse response,
        Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String userEmail = oAuth2User.getAttribute("email");
        String token = jwtProvider.create(userEmail);
        response.addHeader("Authorization", "Bearer " + token);
        String jsonResponse = URLEncoder.encode("{\"code\":\"SU\", \"token\":\"" + token + "\", \"userEmail\":\"" + userEmail + "\"}", "UTF-8");
        response.sendRedirect("http://localhost:3000/oauth/callback"+jsonResponse);

    }

//    private final JwtProvider jwtProvider;
//    private final UserRepository userRepository;
//
//    public CustomSuccessHandler(JwtProvider jwtProvider, UserRepository userRepository) {
//        this.jwtProvider = jwtProvider;
//        this.userRepository = userRepository;
//    }
//
//    @Override
//    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
//        log.info("onAuthenticationSuccess called for user: {}", authentication.getName());
//        // 인증된 사용자의 이메일을 가져옴
//        String email = authentication.getName();
//
//        // 이메일을 통해 사용자 조회
//        Optional<User> userOptional = userRepository.findByEmail(email);
//        if (!userOptional.isPresent()) {
//            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "중복된 이메일입니다.");
//            return;
//        }
//
//        User user = userOptional.get();
//
//        // JWT 생성
//        String token = jwtProvider.create(email);
//
//        // SignInResponseDto 생성
//        ResponseEntity<SignInResponseDto> responseEntity = SignInResponseDto.success(token, user);
//
//        // JSON 응답을 문자열로 변환하여 URL 쿼리 매개변수로 포함
//        String jsonResponse = URLEncoder.encode(SignInResponseDto.success(token, user).getBody().toJsonString(), "UTF-8");
//        response.setHeader("Authorization", "Bearer " + token);
//        // 리다이렉트할 URL
//        String redirectUrl = "http://localhost:3000/oauth/callback";
////        String redirectUrl = "https://i11a508.p.ssafy.io/oauth/callback";
//        response.sendRedirect(redirectUrl);
//
//        log.info("User authenticated: {}", email);
//        log.info("Redirecting to: {}?response={}", r edirectUrl, jsonResponse);
//    }
}
