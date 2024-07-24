package com.a508.wms.employee.dto;

import com.a508.wms.util.constant.LoginTypeEnum;
import com.a508.wms.util.constant.StatusEnum;
import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmployeeDto {

    private Long id;
    private long businessId;
    private String name;
    private LoginTypeEnum loginTypeEnum;
    private String loginId;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private StatusEnum statusEnum;

}

