package com.a508.wms.auth.controller;

import com.a508.wms.auth.service.implement.OAuth2UserServiceImplement;
import com.a508.wms.user.dto.UserResponseDto;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/oauth2/code")
@RequiredArgsConstructor
public class SocialLoginController {

    private final OAuth2UserServiceImplement oAuth2UserService;

    @PostMapping("/{provider}")
    public ResponseEntity<?> handleOAuthCallback(
        @PathVariable String provider,
        @RequestBody Map<String, String> request) {

        String code = request.get("code");

        try {
            // 토큰과 사용자 정보를 반환하는 서비스 메서드 호출
            Map<String, Object> userAttributes = oAuth2UserService.processOAuth2User(code, provider);

            return ResponseEntity.ok(userAttributes); // 사용자 정보를 응답으로 반환
        } catch (Exception e) {
            return ResponseEntity.status(500).body("OAuth2 처리 중 오류 발생");
        }
    }

}
