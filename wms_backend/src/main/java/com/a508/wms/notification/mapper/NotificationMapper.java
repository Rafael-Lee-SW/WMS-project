package com.a508.wms.notification.mapper;

import com.a508.wms.notification.domain.Notification;
import com.a508.wms.notification.dto.NotificationResponseDto;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {
    /**
     * notification -> notificationDto
     *
     * @param notification
     * @return notificationDto
     */
    public static NotificationResponseDto fromNotification(Notification notification) {
        return null;
    }

    /**
     * from notificationDto, business -> notification
     * business 제외. 직접 설정하기
     *
     * @param notificationResponseDto
     * @return Notification
     */
    public static Notification fromDto(NotificationResponseDto notificationResponseDto) {
        return null;
    }

}
