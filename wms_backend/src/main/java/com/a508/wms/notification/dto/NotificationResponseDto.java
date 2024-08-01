package com.a508.wms.notification.dto;

import com.a508.wms.util.constant.StatusEnum;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

// id, businessId, date
// locationName, floor_level, productname, quantity = productpicking
@Builder
@Getter
@Setter
public class NotificationResponseDto {
    private long id;
    private long businessId;
    private boolean readOrNot;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private StatusEnum statusEnum;

}
