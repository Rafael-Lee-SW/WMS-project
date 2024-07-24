package com.a508.wms.subscriptiontype.dto;

import com.a508.wms.util.constant.StatusEnum;
import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class SubscriptionTypeDto {
    private long id;
    private String name;
    private int cost;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private StatusEnum status;


}
