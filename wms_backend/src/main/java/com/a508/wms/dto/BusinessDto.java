package com.a508.wms.dto;

import com.a508.wms.domain.Business;
import com.a508.wms.util.StatusEnum;
import lombok.*;

@RequiredArgsConstructor
@Getter
@Setter
@ToString
@Builder
@AllArgsConstructor
public class BusinessDto {
    private long id;
    private String email;
    private String password;
    private String name;
    private String businessNumber;
    private StatusEnum status;

    /**
     * Business 객체를 받아서 BusinessDto 객체로 변환해주는 메서드
     *
     * @param business
     * @return BusinessDto
     */
    public static BusinessDto fromBusiness(Business business) {
        return new BusinessDto(
                business.getId(),
                business.getEmail(),
                business.getPassword(),
                business.getName(),
                business.getBusinessNumber(),
                business.getStatusEnum());
    }

}
