package com.a508.wms.domain;

import com.a508.wms.util.Status;
import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
@Table(name = "notification")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;

    @Column(nullable = false, length = 255)
    private String content;

    @Column(nullable = false)
    private boolean readOrNot = false;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;

    //연관관계 편의 매서드
    public void setBusiness(Business business) {
        this.business = business;
        business.getNotifications().add(this);
    }
}
