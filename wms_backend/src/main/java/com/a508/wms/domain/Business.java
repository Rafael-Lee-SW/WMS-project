package com.a508.wms.domain;

import com.a508.wms.domain.util.BaseTimeEntity;
import com.a508.wms.dto.BusinessDto;
import com.a508.wms.util.StatusEnum;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
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

    public Business(Builder builder) {
        this.id = builder.id;
        this.email = builder.email;
        this.password = builder.password;
        this.name = builder.name;
        this.businessNumber = builder.businessNumber;
        this.employees = builder.employees;
    }

    public Business() {
    }

    @Getter
    public static class Builder {
        private Long id;
        private String email;
        private String password;
        private String name;
        private String businessNumber;
        private List<Employee> employees;
        public Builder id(Long id) {
            this.id = id;
            return this;
        }
        public Builder email(String email) {
            this.email = email;
            return this;
        }
        public Builder password(String password) {
            this.password = password;
            return this;
        }
        public Builder name(String name) {
            this.name = name;
            return this;
        }
        public Builder businessNumber(String businessNumber) {
            this.businessNumber = businessNumber;
            return this;
        }
        public Builder employees(List<Employee> employees) {
            this.employees = employees;
            return this;
        }
        public Business build() {
            return new Business(this);
        }

    }

}