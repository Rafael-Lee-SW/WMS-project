package com.a508.wms.domain;

import com.a508.wms.domain.util.BaseTimeEntity;
import com.a508.wms.util.StatusEnum;
import jakarta.persistence.*;
import java.util.List;
import lombok.Getter;

@Entity
@Getter
@Table(name = "business")
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

    @OneToMany(mappedBy = "business")
    private List<Employee> employees;

    @OneToMany(mappedBy = "business")
    private List<ProductDetail> productDetails;

    @OneToMany(mappedBy = "business")
    private List<Notification> notifications;

    @OneToMany(mappedBy = "business")
    private List<Subscription> subscriptions;

    @OneToMany(mappedBy = "business")
    private List<Warehouse> warehouses;

}