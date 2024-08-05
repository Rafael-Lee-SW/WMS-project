package com.a508.wms.auth.service.implement;

import com.a508.wms.auth.exception.DuplicatedEmailException;
import com.a508.wms.auth.provider.JwtProvider;
import com.a508.wms.user.domain.User;
import com.a508.wms.user.dto.UserResponseDto;
import com.a508.wms.user.mapper.UserMapper;
import com.a508.wms.user.repository.UserRepository;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;


@Service
@RequiredArgsConstructor
@Slf4j
public class OAuth2UserServiceImplement extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final JwtProvider jwtProvider;

    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String kakaoClientId;
    @Value("${spring.security.oauth2.client.registration.kakao.client-secret}")
    private String kakaoClientSecret;
    @Value("${spring.security.oauth2.client.registration.kakao.redirect-uri}")
    private String kakaoRedirectUri;
    @Value("${spring.security.oauth2.client.provider.kakao.token-uri}")
    private String kakaoTokenUri;
    @Value("${spring.security.oauth2.client.provider.kakao.user-info-uri}")
    private String kakaoUserInfoUri;

    @Value("${spring.security.oauth2.client.registration.naver.client-id}")
    private String naverClientId;
    @Value("${spring.security.oauth2.client.registration.naver.client-secret}")
    private String naverClientSecret;
    @Value("${spring.security.oauth2.client.registration.naver.redirect-uri}")
    private String naverRedirectUri;
    @Value("${spring.security.oauth2.client.provider.naver.token-uri}")
    private String naverTokenUri;
    @Value("${spring.security.oauth2.client.provider.naver.user-info-uri}")
    private String naverUserInfoUri;


    public Map<String, Object> processOAuth2User(String code, String provider) {
        String accessToken = getAccessToken(code, provider);
        Map<String, Object> userAttributes = getUserAttributes(accessToken, provider);

        String email = extractEmail(userAttributes, provider);

        // 이메일 중복 체크 및 처리
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            throw new DuplicatedEmailException("이미 가입된 이메일이 있습니다.");
        }
        User newUser = UserMapper.fromOAuthAttributes(email, provider, userAttributes);
        userRepository.save(newUser);

        // JWT 생성
        String token = jwtProvider.create(email);

        // 사용자 정보를 DTO로 변환하여 반환
        UserResponseDto userResponseDto = UserMapper.toUserResponseDto(newUser);
        Map<String, Object> response = new HashMap<>();
        response.put("user", userResponseDto);
        response.put("token", token);

        return response;
    }
    private String getAccessToken(String code, String provider) {
        // 카카오 및 네이버의 토큰 요청에 필요한 URL 및 파라미터 설정
        String tokenUri;
        String clientId;
        String clientSecret;
        String redirectUri;

        if ("kakao".equals(provider)) {
            tokenUri = kakaoTokenUri;
            clientId = kakaoClientId;
            clientSecret = kakaoClientSecret;
            redirectUri = kakaoRedirectUri;
        } else if ("naver".equals(provider)) {
            tokenUri = naverTokenUri;
            clientId = naverClientId;
            clientSecret = naverClientSecret;
            redirectUri = naverRedirectUri;
        } else {
            throw new IllegalArgumentException("지원하지 않는 제공자입니다: " + provider);
        }

        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(tokenUri)
            .queryParam("grant_type", "authorization_code")
            .queryParam("client_id", clientId)
            .queryParam("client_secret", clientSecret)
            .queryParam("redirect_uri", redirectUri)
            .queryParam("code", code);

        ResponseEntity<Map> responseEntity = restTemplate.postForEntity(uriBuilder.toUriString(), null, Map.class);
        Map<String, String> body = responseEntity.getBody();
        return body.get("access_token");
    }

    private Map<String, Object> getUserAttributes(String accessToken, String provider) {
        String userInfoUri;

        if ("kakao".equals(provider)) {
            userInfoUri = kakaoUserInfoUri;
        } else if ("naver".equals(provider)) {
            userInfoUri = naverUserInfoUri;
        } else {
            throw new IllegalArgumentException("지원하지 않는 제공자입니다: " + provider);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);

        ResponseEntity<Map> responseEntity = restTemplate.exchange(userInfoUri, HttpMethod.GET, new org.springframework.http.HttpEntity<>(headers), Map.class);
        return responseEntity.getBody();
    }



    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(request);
        String oauthClientName = request.getClientRegistration().getClientName();

        // 로깅을 통해 사용자 정보 확인
        log.info("OAuth2 User Attributes: {}", oAuth2User.getAttributes());

        String email = extractEmail(oAuth2User.getAttributes(), oauthClientName);

        // 이메일 중복 체크
        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isPresent()) {
            // 중복된 이메일인 경우 예외 발생
            throw new DuplicatedEmailException("이미 가입된 이메일이 있습니다.");
        }

        // 새로운 사용자 생성 및 저장
        User newUser = UserMapper.fromOAuthAttributes(email, oauthClientName, oAuth2User.getAttributes());
        userRepository.save(newUser);

        return oAuth2User;
    }

    /**
     * 사용자 정보를 기반으로 이메일 추출하는 메서드
     *
     * @param attributes
     * @param oauthClientName
     * @return 이메일
     */
    private String extractEmail(Map<String, Object> attributes, String oauthClientName) {
        if ("kakao".equals(oauthClientName)) {
            Object kakaoAccountObj = attributes.get("kakao_account");
            if (kakaoAccountObj instanceof Map) {
                Map<String, Object> kakaoAccount = (Map<String, Object>) kakaoAccountObj;
                return (String) kakaoAccount.get("email");
            }
        } else if ("naver".equals(oauthClientName)) {
            Object responseObj = attributes.get("response");
            if (responseObj instanceof Map) {
                Map<String, Object> response = (Map<String, Object>) responseObj;
                return (String) response.get("email");
            }
        }
        return null;
    }

}
