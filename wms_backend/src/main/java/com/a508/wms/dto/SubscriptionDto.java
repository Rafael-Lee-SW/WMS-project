package com.a508.wms.dto;


import com.a508.wms.domain.Business;
import com.a508.wms.domain.Subscription;
import com.a508.wms.domain.SubscriptionType;
import com.a508.wms.util.PaidTypeEnum;
import com.a508.wms.util.StatusEnum;
import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class SubscriptionDto {
    private long id;
    private BusinessDto businessDto;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private SubscriptionType subscriptionType;
    private StatusEnum statusEnum;
    private PaidTypeEnum paidTypeEnum;

    /**
     * Subscription 객체를 받아서 SubscriptionDto로 변환해주는 메서드
     * @param subscription : 변환할 객체
     * @return SubscriptionDto
     */
    public static SubscriptionDto toSubscriptionDto(Subscription subscription) {
        return new SubscriptionDto(subscription.getId(),
                BusinessDto.toBusinessDto(subscription.getBusiness()),
                subscription.getStartDate(),
                subscription.getEndDate(),
                subscription.getSubscriptionType(),
                subscription.getStatusEnum(),
                subscription.getPaidTypeEnum());
    }
}
