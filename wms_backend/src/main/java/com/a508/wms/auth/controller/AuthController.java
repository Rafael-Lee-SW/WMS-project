package com.a508.wms.auth.controller;

import static com.a508.wms.user.mapper.UserMapper.toUserResponseDto;

import com.a508.wms.auth.dto.request.auth.CheckCertificationRequestDto;
import com.a508.wms.auth.dto.request.auth.EmailCertificationRequestDto;
import com.a508.wms.auth.dto.request.auth.IdCheckRequestDto;
import com.a508.wms.auth.dto.request.auth.SignInRequestDto;
import com.a508.wms.auth.dto.request.auth.SignUpRequestDto;
import com.a508.wms.auth.dto.response.auth.CheckCertificationResponseDto;
import com.a508.wms.auth.dto.response.auth.EmailCertificationResponseDto;
import com.a508.wms.auth.dto.response.auth.IdCheckResponseDto;
import com.a508.wms.auth.dto.response.auth.SignInResponseDto;
import com.a508.wms.auth.dto.response.auth.SignUpResponseDto;
import com.a508.wms.auth.service.AuthService;
import com.a508.wms.user.domain.User;
import com.a508.wms.user.dto.UserResponseDto;
import com.a508.wms.user.mapper.UserMapper;
import com.a508.wms.user.repository.UserRepository;
import com.a508.wms.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.annotation.RequestScope;

@RestController
@RequestMapping("/oauth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final DefaultOAuth2UserService defaultOAuth2UserService;
    private final UserService userService;
    private final UserRepository userRepository;

    /**
     * 중복 이메일 체크하는 메서드
     * @param requestBody
     * @return
     */

    @PostMapping("/email-check")
    public ResponseEntity<? super IdCheckResponseDto> idCheck(
        @RequestBody @Valid EmailCertificationRequestDto requestBody
    ) {
        return authService.idCheck(requestBody);
    }

    /**
     * email 발송하는 메서드
     * @return
     */
    @PostMapping("/email-certification")
    public ResponseEntity<? super EmailCertificationResponseDto> emailCertification(
        @RequestBody @Valid EmailCertificationRequestDto requestBody
    ){
        ResponseEntity<? super EmailCertificationResponseDto> response =
            authService.emailCertification(requestBody);
        return response;
    }

    /**
     * email 검증하는 메서드
     * @param requestBody
     * @return
     */
    @PostMapping("/check-certification")
    public ResponseEntity<? super CheckCertificationResponseDto> checkCertification(
        @RequestBody @Valid CheckCertificationRequestDto requestBody
    ){
        ResponseEntity<? super CheckCertificationResponseDto> response =authService.checkCertification(requestBody);
        return response;
    }

    @PostMapping("/sign-up")
    public ResponseEntity<? super SignUpResponseDto> signUp(
        @RequestBody  SignUpRequestDto requestBody
    ){
        ResponseEntity<? super SignUpResponseDto> response =authService.signUp(requestBody);
        return response;
    }

    @PostMapping("/sign-in")
    public ResponseEntity<? super SignInResponseDto> signIn(
        @RequestBody @Valid SignInRequestDto requestBody
    ) {
        ResponseEntity<? super SignInResponseDto> response = authService.signIn(requestBody);
        return response;
    }

    @GetMapping("/social-sign-in")
    public ResponseEntity<UserResponseDto> getUserInfo(
        @RequestHeader("Authorization") String token,
        @RequestParam String email
    ) {
        // 토큰과 이메일을 검증하여 사용자 정보 반환
        User user = userService.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        UserResponseDto userResponseDto = UserMapper.toUserResponseDto(user);
        return ResponseEntity.ok(userResponseDto);
    }
}
