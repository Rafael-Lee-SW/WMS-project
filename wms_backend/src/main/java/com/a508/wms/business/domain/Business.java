package com.a508.wms.business.domain;

import com.a508.wms.auth.dto.request.auth.SignUpRequestDto;
import com.a508.wms.employee.domain.Employee;
import com.a508.wms.notification.domain.Notification;
import com.a508.wms.productdetail.domain.ProductDetail;
import com.a508.wms.subscription.domain.Subscription;
import com.a508.wms.util.BaseTimeEntity;
import com.a508.wms.util.constant.StatusEnum;
import com.a508.wms.warehouse.domain.Warehouse;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

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

    @Column(nullable = false, length = 100)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(length = 20)
    private String name;

    @Column(length = 12)
    private String businessNumber;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusEnum statusEnum = StatusEnum.ACTIVE;

    // 추가된 필드들
    @Column(length = 50)
    private String nickname;

    @Builder.Default
    @Column(nullable = false, length = 10)
    private String socialLoginType = "일반"; // 기본값은 '일반'

    @Builder.Default
    @Column(nullable = false)
    private int role = 0; // 기본값은 0 (직원)

    @OneToMany(mappedBy = "business")
    private List<Employee> employees = new ArrayList<>();

    @OneToMany(mappedBy = "business")
    private List<ProductDetail> productDetails = new ArrayList<>();

    @OneToMany(mappedBy = "business")
    private List<Notification> notifications = new ArrayList<>();

    @OneToMany(mappedBy = "business")
    private List<Subscription> subscriptions = new ArrayList<>();

    @OneToMany(mappedBy = "business")
    private List<Warehouse> warehouses = new ArrayList<>();

    public Business(SignUpRequestDto dto) {
        this.email = dto.getEmail();
        this.password = dto.getPassword();
        this.role = 0;
        this.statusEnum = StatusEnum.ACTIVE;
        this.nickname = "설정해주세용";
        }

    public void setStatusEnum(StatusEnum statusEnum) {
        this.statusEnum = statusEnum;
    }

    public void setEmployees(List<Employee> employees) {
        this.employees = employees;
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