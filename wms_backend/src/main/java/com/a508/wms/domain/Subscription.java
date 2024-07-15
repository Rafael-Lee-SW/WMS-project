package com.a508.wms.domain;

import com.a508.wms.domain.util.BaseTimeEntity;
import com.a508.wms.util.PaidTypeEnum;
import com.a508.wms.util.StatusEnum;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;

@Entity
@Getter
@Table(name = "subscription")
public class Subscription extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name="business_id",nullable = false)
    @ManyToOne
    private Business business;

    @JoinColumn(name="subscription_type_id",nullable = false)
    @ManyToOne
    private SubscriptionType subscriptionType;

    @CreatedDate
    @Column(updatable = false,nullable = false)
    private LocalDateTime startDate;

    @CreatedDate
    @Column(updatable = false,nullable = false)
    private LocalDateTime endDate;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private PaidTypeEnum name;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusEnum statusEnum = StatusEnum.ACTIVE;

    // 연관관계 편의 메서드
    public void setBusiness(Business business) {
        this.business = business;
        business.getSubscriptions().add(this);
    }
}
