package com.a508.wms.subscription.domain;

import com.a508.wms.business.domain.Business;
import com.a508.wms.util.BaseTimeEntity;
import com.a508.wms.util.constant.PaidTypeEnum;
import com.a508.wms.util.constant.StatusEnum;
import com.a508.wms.util.constant.SubscriptionTypeEnum;
import jakarta.persistence.*;

import java.time.LocalDateTime;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;

@Entity
@Getter
@Table(name = "subscription")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Subscription extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private SubscriptionTypeEnum subscriptionTypeEnum;

    @CreatedDate
    @Column(updatable = false, nullable = false)
    private LocalDateTime startDate;

    @CreatedDate
    @Column(updatable = false, nullable = false)
    private LocalDateTime endDate;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private PaidTypeEnum paidTypeEnum;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StatusEnum statusEnum = StatusEnum.ACTIVE;

    // 연관관계 편의 메서드
    public void setBusiness(Business business) {
        this.business = business;
        business.getSubscriptions().add(this);
    }

    public void setStatusEnum(StatusEnum statusEnum) {
        this.statusEnum = statusEnum;
    }

    public void setSubscriptionTypeEnum(SubscriptionTypeEnum subscriptionTypeEnum) {
        this.subscriptionTypeEnum = subscriptionTypeEnum;
    }

    public void setPaidTypeEnum(PaidTypeEnum paidTypeEnum) {
        this.paidTypeEnum = paidTypeEnum;
    }

    public void setId(Long id) {
        this.id = id;
    }


}
