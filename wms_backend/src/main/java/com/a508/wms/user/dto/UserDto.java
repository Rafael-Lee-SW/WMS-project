package com.a508.wms.user.dto;

import com.a508.wms.business.dto.BusinessResponseDto;
import com.a508.wms.util.constant.LoginTypeEnum;
import com.a508.wms.util.constant.RoleTypeEnum;
import com.a508.wms.util.constant.StatusEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDto {

    private Long id;
    private String email;
    private String password;
    private String name;
    private String nickname;
    private RoleTypeEnum roleTypeEnum;
    private LoginTypeEnum loginTypeEnum;
    private StatusEnum statusEnum;
    private BusinessResponseDto business; // BusinessDto와의 관계를 반영
}
