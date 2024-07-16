package com.a508.wms.dto;

import lombok.*;

@Setter
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeDto {

    private Long id;
    private Long businessId;
    private String loginType;
    private String loginId;
}

