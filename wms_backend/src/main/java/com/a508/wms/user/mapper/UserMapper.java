package com.a508.wms.user.mapper;

import com.a508.wms.auth.dto.request.auth.SignUpRequestDto;
import com.a508.wms.user.domain.User;
import com.a508.wms.user.dto.UserDto;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    /**
     * UserDto 객체를 받아서 변경할 정보는 입력하고 기존 정보는 유지하여 User 객체로 변경해주는 메서드 business 제외. 직접 설정하기
     *
     * @param userDto
     * @return User
     */
    public static User fromDto(UserDto userDto) {
        return User.builder()
            .id(userDto.getId())
            .email(userDto.getEmail())
            .password(userDto.getPassword())
            .name(userDto.getName())
            .nickname(userDto.getNickname())
            .roleTypeEnum(userDto.getRoleTypeEnum())
            .loginTypeEnum(userDto.getLoginTypeEnum())
            .statusEnum(userDto.getStatusEnum())
            .build();
    }

    public static User fromSignUpRequestDto(SignUpRequestDto userDto) {
        return User.builder()
            .email(userDto.getEmail())
            .password(userDto.getPassword())
            .build();
    }

    /**
     * User 객체를 받아서 UserDto 객체로 변환해주는 메서드
     *
     * @param user
     * @return UserDto
     */
    public static UserDto fromUser(User user) {
        return UserDto.builder()
            .id(user.getId())
            .email(user.getEmail())
            .password(user.getPassword())
            .name(user.getName())
            .nickname(user.getNickname())
            .roleTypeEnum(user.getRoleTypeEnum())
            .loginTypeEnum(user.getLoginTypeEnum())
            .statusEnum(user.getStatusEnum())
//            .business(user.getBusiness() != null ? BusinessMapper.fromBusiness(user.getBusiness()) : null)
            .build();
    }
}
