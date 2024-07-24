package com.a508.wms.dto;

import com.a508.wms.domain.Subscription;
import com.a508.wms.util.constant.PaidTypeEnum;
import com.a508.wms.util.constant.StatusEnum;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionDto {
    private Long id;
    private Long businessId;
    private Long subscriptionTypeId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private PaidTypeEnum paidTypeEnum;
    private StatusEnum statusEnum;




}
