package com.a508.wms.domain;

import com.a508.wms.util.PaidType;
import com.a508.wms.util.Status;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDateTime;
import org.springframework.data.annotation.CreatedDate;

@Entity
public class Subscription {

    @Id
    private Long id;

    @JoinColumn(name="business_id")
    @ManyToOne
    private Business business;

    @JoinColumn(name="subscription_type_id")
    @ManyToOne
    private SubscriptionType subscriptionType;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime startDate;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime endDate;

    @Enumerated(EnumType.STRING)
    private PaidType name;

    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;
}
