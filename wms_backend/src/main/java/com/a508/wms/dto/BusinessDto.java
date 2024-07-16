package com.a508.wms.dto;

import com.a508.wms.domain.Business;
import com.a508.wms.domain.Employee;
import lombok.*;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class BusinessDto {
    private long id;
    private String email;
    private String password;
    private String name;
    private String businessNumber;
    private String Status;
    private List<Employee> employees;

    // Business 객체를 BusinessDto 객체로 변환
    public static BusinessDto toBusinessDto(Business business) {
        return new BusinessDto(
                business.getId(),
                business.getEmail(),
                business.getPassword(),
                business.getName(),
                business.getBusinessNumber(),
                String.valueOf(business.getStatusEnum()),
                business.getEmployees());
    }

}
