package com.a508.wms.business.dto;

import com.a508.wms.user.dto.UserDto;
import com.a508.wms.util.constant.StatusEnum;
import com.a508.wms.notification.dto.NotificationDto;
import com.a508.wms.subscription.dto.SubscriptionDto;
import com.a508.wms.warehouse.dto.WarehouseDto;
import lombok.*;

import java.util.List;

@Setter
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BusinessDto {

    private Long id;
    private String name;
    private String businessNumber;
    private StatusEnum statusEnum;
    private UserDto user; // UserDto와의 관계를 반영
    private List<NotificationDto> notificationDtoList;
    private List<SubscriptionDto> subscriptionDtoList;
    private List<WarehouseDto> warehouseDtoList;
}
