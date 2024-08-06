package com.a508.wms.auth.service.implement;

import com.a508.wms.auth.exception.DuplicatedEmailException;
import com.a508.wms.user.domain.User;
import com.a508.wms.user.mapper.UserMapper;
import com.a508.wms.user.repository.UserRepository;
import java.util.Map;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


@Service
@RequiredArgsConstructor
@Slf4j
public class OAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final RestTemplate restTemplate = new RestTemplate();



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
