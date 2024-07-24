package com.a508.wms.business;

import com.a508.wms.employee.EmployeeDto;
import com.a508.wms.notification.NotificationDto;
import com.a508.wms.productdetail.ProductDetailRequestDto;
import com.a508.wms.productdetail.ProductDetailResponseDto;
import com.a508.wms.subscription.SubscriptionDto;
import com.a508.wms.util.constant.StatusEnum;
import com.a508.wms.warehouse.WarehouseDto;
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
