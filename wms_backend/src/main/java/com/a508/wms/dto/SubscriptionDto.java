package com.a508.wms.dto;

import com.a508.wms.domain.Subscription;
import com.a508.wms.util.constant.PaidTypeEnum;
import com.a508.wms.util.constant.StatusEnum;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionDto {
    private Long id;
    private Long businessId;
    private SubscriptionTypeDto subscriptionTypeDto;
    private PaidTypeEnum paidTypeEnum;
    private StatusEnum statusEnum;

    /**
     * Subscription 객체를 SubscriptionDto로 변경해주는 메서드
     *
     * @param subscription
     * @return SubscriptionDto 객체
     */
    public static SubscriptionDto fromSubscription(Subscription subscription) {
        return new SubscriptionDto(
                subscription.getId(),
                subscription.getBusiness().getId(),
                SubscriptionTypeDto.fromSubscriptionType(subscription.getSubscriptionType()),
                subscription.getPaidTypeEnum(),
                subscription.getStatusEnum()
        );
    }

    /**
     * SubscriptionDto 객체를 Subscription으로 변경해주는 메서드
     *
     * @param subscriptionDto
     * @return Subscription 객체
     */
    //    forEach문으로 각각 Dto에 있는 정보를 순회하면서, Dto의 정보가 null이 아닌 경우 해당 값을 대입하는 메서드
//        subsciripton이 가지고 있어야 할 정보는 business인데 dto에는 businessdto가 있고,
//        business를 businessDto의 형태로 변환하는 메서드는 Business Entity에 있어서
//        Business Entity에 static 메서드를 선언해야 할듯
    public static Subscription toSubscription(SubscriptionDto subscriptionDto) {
        Subscription subscription = new Subscription();
        subscription.setId(subscriptionDto.getId());
        subscription.setSubscriptionType(SubscriptionTypeDto.toSubscriptionType(subscriptionDto.getSubscriptionTypeDto()));
        subscription.setPaidTypeEnum(subscriptionDto.getPaidTypeEnum());
        subscription.setStatusEnum(subscriptionDto.getStatusEnum());
        return subscription;
    }
}
