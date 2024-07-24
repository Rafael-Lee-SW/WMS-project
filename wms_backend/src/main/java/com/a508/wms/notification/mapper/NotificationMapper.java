package com.a508.wms.notification.mapper;

import com.a508.wms.notification.domain.Notification;
import com.a508.wms.notification.dto.NotificationDto;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {
    /**
     * notification -> notificationDto
     * @param notification
     * @return notificationDto
     */
    public static NotificationDto fromNotification(Notification notification) {
        return NotificationDto.builder()
                .id(notification.getId())
                .businessId(notification.getBusiness().getId())
                .content(notification.getContent())
                .readOrNot(notification.isReadOrNot())
                .createdDate(notification.getCreatedDate())
                .updatedDate(notification.getUpdatedDate())
                .statusEnum(notification.getStatusEnum())
                .build();
    }

    /**
     * from notificationDto, business -> notification
     *  business 제외. 직접 설정하기
     * @param notificationDto
     * @return Notification
     */
    public static Notification fromDto(NotificationDto notificationDto) {
        return Notification.builder()
                .id(notificationDto.getId())
                .content(notificationDto.getContent())
                .readOrNot(notificationDto.isReadOrNot())
                .statusEnum(notificationDto.getStatusEnum())
                .build();
    }

}
