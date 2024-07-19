package com.a508.wms.dto;

import com.a508.wms.domain.Employee;
import com.a508.wms.util.LoginTypeEnum;
import com.a508.wms.util.StatusEnum;
import lombok.*;

@Setter
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmployeeDto {

    private Long id;
    private BusinessDto businessDto;
    private String name;
    private LoginTypeEnum loginType;
    private String loginId;
    private StatusEnum status;

    /**
     * Employee 객체를 받아서 EmployeeDto 객체로 변환해주는 메서드
     *
     * @param employee
     * @return EmployeeDto
     */
    public static EmployeeDto toEmployeeDto(Employee employee) {
        return new EmployeeDto(
                employee.getId(),
                BusinessDto.fromBusiness(employee.getBusiness()),
                employee.getName(),
                employee.getLoginTypeEnum(),
                employee.getLoginId(),
                employee.getStatusEnum());
    }
}

