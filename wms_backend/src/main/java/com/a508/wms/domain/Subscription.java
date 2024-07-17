package com.a508.wms.domain;

import com.a508.wms.domain.util.BaseTimeEntity;
import com.a508.wms.dto.SubscriptionDto;
import com.a508.wms.util.PaidTypeEnum;
import com.a508.wms.util.StatusEnum;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;

@Entity
@Getter
@Table(name = "subscription")
public class Subscription extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name="business_id",nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private Business business;

    @JoinColumn(name="subscription_type_id",nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private SubscriptionType subscriptionType;

    @CreatedDate
    @Column(updatable = false,nullable = false)
    private LocalDateTime startDate;

    @CreatedDate
    @Column(updatable = false,nullable = false)
    private LocalDateTime endDate;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private PaidTypeEnum paidTypeEnum;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusEnum statusEnum = StatusEnum.ACTIVE;

    public Subscription(Builder builder) {
        id = builder.id;
        startDate = builder.startDate;
        business = builder.business;
        subscriptionType = builder.subscriptionType;
        endDate = builder.endDate;
        paidTypeEnum = builder.paidTypeEnum;
        statusEnum = builder.statusEnum;
    }

    public Subscription() {
    }

    // 연관관계 편의 메서드
    public void setBusiness(Business business) {
        this.business = business;
        business.getSubscriptions().add(this);
    }

    @Getter
    @Setter
    public static class Builder
    {
        private Long id;
        private Business business;
        private SubscriptionType subscriptionType;
        private LocalDateTime startDate;
        private LocalDateTime endDate;
        private PaidTypeEnum paidTypeEnum;
        private StatusEnum statusEnum;
        public Builder id(Long id) {
            this.id = id;
            return this;
        }
        public Builder business(Business business) {
            this.business = business;
            return this;
        }
        public Builder subscriptionType(SubscriptionType subscriptionType) {
            this.subscriptionType = subscriptionType;
            return this;
        }
        public Builder startDate(LocalDateTime startDate) {
            this.startDate = startDate;
            return this;
        }
        public Builder endDate(LocalDateTime endDate) {
            this.endDate = endDate;
            return this;
        }
        public Builder paidTypeEnum(PaidTypeEnum paidTypeEnum) {
            this.paidTypeEnum = paidTypeEnum;
            return this;
        }
        public Builder statusEnum(StatusEnum statusEnum) {
            this.statusEnum = statusEnum;
            return this;
        }
        public Subscription build() {
            return new Subscription(this);
        }
    }
    public Subscription toSubscription(SubscriptionDto subscriptionDto) {
        Subscription subscription = new Subscription();
//        subsciripton이 가지고 있어야 할 정보는 business인데 dto에는 businessdto가 있고,
//        business를 businessDto의 형태로 변환하는 메서드는 Business Entity에 있어서
//        Business Entity에 static 메서드를 선언해야 할듯
        subscription.id = subscriptionDto.getId();
        subscription.business = Business.dtoToBusiness(subscriptionDto.getBusinessDto());
        subscription.subscriptionType = subscriptionDto.getSubscriptionType();
        subscription.statusEnum = subscriptionDto.getStatusEnum();
        subscription.paidTypeEnum = subscriptionDto.getPaidTypeEnum();
        subscription.startDate = subscriptionDto.getStartTime();
        subscription.endDate = subscriptionDto.getEndTime();
        return subscription;
    }
}
