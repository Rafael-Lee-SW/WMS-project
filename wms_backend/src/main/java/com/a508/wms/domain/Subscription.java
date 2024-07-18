package com.a508.wms.domain;

import com.a508.wms.domain.util.BaseTimeEntity;
import com.a508.wms.dto.SubscriptionDto;
import com.a508.wms.dto.SubscriptionTypeDto;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="business_id", nullable = false)
    private Business business;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="subscription_type_id", nullable = false)
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

    public void setStatusEnum(StatusEnum statusEnum) {
        this.statusEnum = statusEnum;
    }

    public void setSubscriptionType(SubscriptionType subscriptionType) {
        this.subscriptionType = subscriptionType;
    }
    public void setPaidTypeEnum(PaidTypeEnum paidTypeEnum) {
        this.paidTypeEnum = paidTypeEnum;
    }
    public void setId(Long id) {
        this.id = id;
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





}
