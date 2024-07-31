package com.a508.wms.notification.mapper;

import com.a508.wms.notification.domain.Notification;
import com.a508.wms.notification.dto.NotificationResponseDto;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {
    /**
     * notification -> notificationDto
     * @param notification
     * @return notificationDto
     */
    public static NotificationResponseDto fromNotification(Notification notification) {
        return NotificationResponseDto.builder()
                .id(notification.getId())
                .businessId(notification.getBusiness().getId())
                .readOrNot(notification.isReadOrNot())
                .createdDate(notification.getCreatedDate())
                .updatedDate(notification.getUpdatedDate())
                .statusEnum(notification.getStatusEnum())
                .build();
    }

    /**
     * from notificationDto, business -> notification
     *  business 제외. 직접 설정하기
     * @param notificationResponseDto
     * @return Notification
     */
    public static Notification fromDto(NotificationResponseDto notificationResponseDto) {
        return Notification.builder()
                .id(notificationResponseDto.getId())
                .readOrNot(notificationResponseDto.isReadOrNot())
                .statusEnum(notificationResponseDto.getStatusEnum())
                .build();
    }

}
