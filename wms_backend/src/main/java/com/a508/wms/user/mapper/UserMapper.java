package com.a508.wms.user.mapper;

import com.a508.wms.auth.dto.request.auth.SignUpRequestDto;
import com.a508.wms.business.mapper.BusinessMapper;
import com.a508.wms.user.domain.User;
import com.a508.wms.user.dto.UserResponseDto;
import com.a508.wms.util.constant.LoginTypeEnum;
import com.a508.wms.util.constant.RoleTypeEnum;
import com.a508.wms.util.constant.StatusEnum;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public static User fromSignUpRequestDto(SignUpRequestDto dto) {
        return User.builder()
            .email(dto.getEmail())
            .password(dto.getPassword())
            .name(dto.getName())
            .nickname(dto.getNickname())
            .roleTypeEnum(RoleTypeEnum.GENERAL) // 기본값 설정
            .loginTypeEnum(LoginTypeEnum.GENERAL) // 기본값 설정
            .statusEnum(StatusEnum.ACTIVE) // 기본값 설정
            .businessId(null) // businessId는 null로 설정
            .build();
    }

    /**
     * User 객체를 받아서 UserDto 객체로 변환해주는 메서드
     *
     * @param user
     * @return UserDto
     */
    public static UserResponseDto toUserResponseDto(User user) {
        return UserResponseDto.builder()
            .id(user.getId())
            .email(user.getEmail())
            .name(user.getName())
            .nickname(user.getNickname())
            .roleTypeEnum(user.getRoleTypeEnum())
            .loginTypeEnum(user.getLoginTypeEnum())
            .statusEnum(user.getStatusEnum())
            .business(user.getBusiness() != null ? BusinessMapper.toBusinessResponseDto(
                user.getBusiness()) : null)
            .build();
    }
    /**
     * OAuth 사용자 정보를 기반으로 User 객체 생성
     *
     * @param email
     * @param oauthClientName
     * @param attributes
     * @return User 객체
     */
    public static User fromOAuthAttributes(String email, String oauthClientName,
        Map<String, Object> attributes) {
        String name = null;
        String nickname = null;

        if ("kakao".equals(oauthClientName)) {
            Map<String, Object> properties = (Map<String, Object>) attributes.get("properties");
            name = (String) properties.get("nickname");
            nickname = name;
        } else if ("naver".equals(oauthClientName)) {
            name = (String) attributes.get("name");
            nickname = (String) attributes.get("nickname");
        }

        return User.builder()
            .email(email)
            .password("") // 소셜 로그인에서는 비밀번호가 필요하지 않음
            .name(name)
            .nickname(nickname)
            .roleTypeEnum(RoleTypeEnum.GENERAL) // 기본 역할 설정
            .loginTypeEnum(
                LoginTypeEnum.valueOf(oauthClientName.toUpperCase())) // OAuth 공급자로 로그인 타입 설정
            .statusEnum(StatusEnum.ACTIVE) // 기본 상태 설정
            .businessId(null)
            .build();
    }

}
