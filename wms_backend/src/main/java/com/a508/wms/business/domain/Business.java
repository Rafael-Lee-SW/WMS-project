package com.a508.wms.business.domain;

import com.a508.wms.auth.dto.request.auth.SignUpRequestDto;
import com.a508.wms.user.domain.User;
import com.a508.wms.notification.domain.Notification;
import com.a508.wms.productdetail.domain.ProductDetail;
import com.a508.wms.subscription.domain.Subscription;
import com.a508.wms.util.BaseTimeEntity;
import com.a508.wms.util.constant.StatusEnum;
import com.a508.wms.warehouse.domain.Warehouse;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Table(name = "business")
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class Business extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(length = 20)
    private String name;

    @Column(length = 12)
    private String businessNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusEnum statusEnum = StatusEnum.ACTIVE;

    @OneToMany(mappedBy = "business")
    private List<ProductDetail> productDetails = new ArrayList<>();

    @OneToMany(mappedBy = "business")
    private List<Notification> notifications = new ArrayList<>();

    @OneToMany(mappedBy = "business")
    private List<Subscription> subscriptions = new ArrayList<>();

    @OneToMany(mappedBy = "business")
    private List<Warehouse> warehouses = new ArrayList<>();




    // 연관 관계 편의 메서드
    public void setUser(User user) {
        this.user = user;
        if (user != null) {
            user.setBusiness(this);
        }
    }

    public void setStatusEnum(StatusEnum statusEnum) {
        this.statusEnum = statusEnum;
    }

    public void setProductDetails(List<ProductDetail> productDetails) {
        this.productDetails = productDetails;
    }

    public void setNotifications(List<Notification> notifications) {
        this.notifications = notifications;
    }

    public void setSubscriptions(List<Subscription> subscriptions) {
        this.subscriptions = subscriptions;
    }

    public void setWarehouses(List<Warehouse> warehouses) {
        this.warehouses = warehouses;
    }
}
