package com.a508.wms.business.mapper;

import com.a508.wms.business.domain.Business;
import com.a508.wms.business.dto.BusinessDto;
import com.a508.wms.user.domain.User;
import com.a508.wms.user.dto.UserDto;
import com.a508.wms.user.mapper.UserMapper;
import com.a508.wms.notification.domain.Notification;
import com.a508.wms.subscription.domain.Subscription;
import com.a508.wms.subscription.dto.SubscriptionDto;
import com.a508.wms.notification.mapper.NotificationMapper;
import com.a508.wms.subscription.mapper.SubscriptionMapper;
import com.a508.wms.warehouse.domain.Warehouse;
import com.a508.wms.warehouse.dto.WarehouseDto;
import com.a508.wms.warehouse.mapper.WarehouseMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class BusinessMapper {
    /**
     * BusinessDto 객체를 받아서 변경할 정보는 입력하고 기존 정보는 유지하여 Business 객체로 변경해주는 메서드
     * subscriptionType, productStorageType 제외. 직접 설정하기
     *
     * @param businessDto
     * @return Business
     */
    public static Business fromDto(BusinessDto businessDto) {
        Business business = Business.builder()
            .id(businessDto.getId())
            .name(businessDto.getName())
            .businessNumber(businessDto.getBusinessNumber())
            .statusEnum(businessDto.getStatusEnum())
            .build();
        if (businessDto.getUserDto() != null) {
            User user = UserMapper.fromDto( businessDto.getUserDto());
            business.setUser(user);
        }
//        TODO: 여기에 Product 변환 메서드 작성
//        if (businessDto.getNotificationDtoList() != null) {
//            List<Notification> notifications = businessDto.getNotificationDtoList()
//                    .stream().map(NotificationMapper::fromDto)
//                    .toList();
//            business.setNotifications(notifications);
//        }
        if (businessDto.getSubscriptionDtoList() != null) {
            List<Subscription> subscriptions = businessDto.getSubscriptionDtoList()
                .stream().map(SubscriptionMapper::fromDto)
                .toList();
            business.setSubscriptions(subscriptions);
        }
        if (businessDto.getWarehouseDtoList() != null) {
            List<Warehouse> warehouses = businessDto.getWarehouseDtoList()
                .stream().map(WarehouseMapper::fromDto)
                .toList();
            business.setWarehouses(warehouses);
        }
        return business;
    }

    /**
     * Business -> BusinessDto 변환
     * @param business
     * @return BusinessDto
     */
    public static BusinessDto fromBusiness(Business business) {
        BusinessDto businessDto = BusinessDto.builder()
            .id(business.getId())
            .name(business.getName())
            .businessNumber(business.getBusinessNumber())
            .createdDate(business.getCreatedDate())
            .updatedDate(business.getUpdatedDate())
            .statusEnum(business.getStatusEnum())
            .build();
        if (business.getUser() != null) {
            UserDto userDto = UserMapper.fromUser(business.getUser());
            businessDto.setUserDto(userDto);
        }
//        TODO: 여기에 Product 변환 메서드 작성
//        if (business.getNotifications() != null) {
//            List<NotificationDto> notifications = business.getNotifications()
//                    .stream().map(NotificationMapper::fromNotification)
//                    .toList();
//            businessDto.setNotificationDtoList(notifications);
//        }
        if (business.getSubscriptions() != null) {
            List<SubscriptionDto> subscriptions = business.getSubscriptions()
                .stream().map(SubscriptionMapper::fromSubscription)
                .toList();
            businessDto.setSubscriptionDtoList(subscriptions);
        }
        if (business.getWarehouses() != null) {
            List<WarehouseDto> warehouses = business.getWarehouses()
                .stream().map(WarehouseMapper::fromWarehouse)
                .toList();
            businessDto.setWarehouseDtoList(warehouses);
        }
        return businessDto;
    }
}