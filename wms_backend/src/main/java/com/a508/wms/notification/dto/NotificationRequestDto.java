package com.a508.wms.notification.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
public class NotificationRequestDto {
    private Long businessId;
    private boolean readOrNot;
    private LocalDateTime date; // 알림 보낸 날짜

}
