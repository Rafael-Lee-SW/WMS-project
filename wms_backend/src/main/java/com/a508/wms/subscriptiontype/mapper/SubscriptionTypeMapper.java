package com.a508.wms.subscriptiontype.mapper;

import com.a508.wms.subscriptiontype.domain.SubscriptionType;
import com.a508.wms.subscriptiontype.dto.SubscriptionTypeDto;
import org.springframework.stereotype.Component;

@Component
public class SubscriptionTypeMapper {
    /**
     * SubscriptionType을 SubscriptionTypeDto로 변경하는 메서드
     *
     * @param subscriptionType
     * @return SubscriptionTypeDto 객6체
     */
    public static SubscriptionTypeDto fromSubscriptionType(SubscriptionType subscriptionType) {
        return SubscriptionTypeDto.builder()
                .id(subscriptionType.getId())
                .name(subscriptionType.getName())
                .cost(subscriptionType.getCost())
                .createdDate(subscriptionType.getCreatedDate())
                .updatedDate(subscriptionType.getUpdatedDate())
                .status(subscriptionType.getStatusEnum())
                .build();
    }

    /**
     * SubscriptionTypeDto를 SubscriptionType으로 변경해주는 메서드
     *
     * @param subscriptionTypeDto
     * @return SubscriptionType 객체
     */
    public static SubscriptionType fromDto(SubscriptionTypeDto subscriptionTypeDto) {
        return SubscriptionType.builder()
                .id(subscriptionTypeDto.getId())
                .name(subscriptionTypeDto.getName())
                .cost(subscriptionTypeDto.getCost())
                .statusEnum(subscriptionTypeDto.getStatus())
                .build();
    }
}
