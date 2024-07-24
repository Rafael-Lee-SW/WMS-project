package com.a508.wms.business.dto;

import com.a508.wms.employee.dto.EmployeeDto;
import com.a508.wms.notification.dto.NotificationDto;
import com.a508.wms.productdetail.dto.ProductDetailRequestDto;
import com.a508.wms.productdetail.dto.ProductDetailResponseDto;
import com.a508.wms.subscription.dto.SubscriptionDto;
import com.a508.wms.util.constant.StatusEnum;
import com.a508.wms.warehouse.dto.WarehouseDto;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BusinessDto {

    private long id;
    private String email;
    private String password;
    private String name;
    private String businessNumber;
    private String nickname;
    private String socialLoginType; // 소셜 로그인 타입
    private int role; // 관리자 여부 (0: 직원, 1: 사장)
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private StatusEnum statusEnum;
    private List<EmployeeDto> employeeDtoList;
    private List<ProductDetailRequestDto> productDetailRequestDtoList;
    private List<ProductDetailResponseDto> productDetailResponseDtoList;
    private List<NotificationDto> notificationDtoList;
    private List<SubscriptionDto> subscriptionDtoList;
    private List<WarehouseDto> warehouseDtoList;


}
