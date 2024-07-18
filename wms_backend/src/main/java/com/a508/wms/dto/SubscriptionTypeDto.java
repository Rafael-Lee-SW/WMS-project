package com.a508.wms.dto;

import com.a508.wms.domain.Subscription;
import com.a508.wms.domain.SubscriptionType;
import com.a508.wms.util.StatusEnum;
import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class SubscriptionTypeDto {
    private long id;
    private String name;
    private int cost;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private StatusEnum status;

    /**
     * SubscriptionType을 SubscriptionTypeDto로 변경하는 메서드
     * @param subscriptionType
     * @return SubscriptionTypeDto 객체
     */
    public static SubscriptionTypeDto toSubscriptionTypeDto(SubscriptionType subscriptionType) {
       return new SubscriptionTypeDto(
               subscriptionType.getId(),
               subscriptionType.getName(),
               subscriptionType.getCost(),
               subscriptionType.getCreatedDate(),
               subscriptionType.getUpdatedDate(),
               subscriptionType.getStatusEnum());
    }

    /**
     * SubscriptionTypeDto를 SubscriptionType으로 변경해주는 메서드
     * @param subscriptionTypeDto
     * @return SubsciriptonType 객체
     */
    public static SubscriptionType dtoToSubscriptionType(SubscriptionTypeDto subscriptionTypeDto) {
        SubscriptionType.Builder builder = new SubscriptionType.Builder();
        builder.id(subscriptionTypeDto.getId());
        builder.name(subscriptionTypeDto.getName());
        builder.cost(subscriptionTypeDto.getCost());
        builder.statusEnum(subscriptionTypeDto.getStatus());
        return builder.build();
    }
}
