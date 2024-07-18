package com.a508.wms.domain;

import com.a508.wms.domain.util.BaseTimeEntity;
import com.a508.wms.dto.BusinessDto;
import com.a508.wms.util.StatusEnum;
import jakarta.persistence.*;

import java.util.ArrayList;
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
    private List<Employee> employees = new ArrayList<>();

    @OneToMany(mappedBy = "business")
    private List<ProductDetail> productDetails = new ArrayList<>();

    @OneToMany(mappedBy = "business")
    private List<Notification> notifications = new ArrayList<>();

    @OneToMany(mappedBy = "business")
    private List<Subscription> subscriptions = new ArrayList<>();

    @OneToMany(mappedBy = "business")
    private List<Warehouse> warehouses = new ArrayList<>();

    public void setStatusEnum(StatusEnum statusEnum) {
        this.statusEnum = statusEnum;
    }

    public Business(Builder builder) {
        this.id = builder.id;
        this.email = builder.email;
        this.password = builder.password;
        this.name = builder.name;
        this.businessNumber = builder.businessNumber;
        this.statusEnum = builder.statusEnum;
    }

    public Business() {
    }

    /**
     * Builder 클래스: Dto 생성을 위한 클래스
     */
    @Getter
    public static class Builder {
        private Long id;
        private String email;
        private String password;
        private String name;
        private String businessNumber;
        private StatusEnum statusEnum;
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
       public Builder statusEnum(StatusEnum statusEnum) {
            this.statusEnum = statusEnum;
            return this;
       }
        public Business build() {
            return new Business(this);
        }

    }

    /**
     * BusinessDto 객체를 받아서 해당 객체의 정보를 그대로 Business 객체로 변경해주는 메서드
     * @param businessDto
     * @return
     */
    public static Business dtoToBusiness(BusinessDto businessDto) {
        Business.Builder builder = new Business.Builder();
        builder.email(businessDto.getEmail());
        builder.password(businessDto.getPassword());
        builder.businessNumber(businessDto.getBusinessNumber());
        builder.name(businessDto.getName());
        builder.businessNumber(businessDto.getBusinessNumber());
        builder.statusEnum(businessDto.getStatus());
        return builder.build();
    }
    /**
     * BusinessDto 객체를 받아서 변경할 정보는 입력하고 기존 정보는 유지하여 Business 객체로 변경해주는 메서드
     * @param businessDto
     * @return Business
     */
    public Business toBusiness(BusinessDto businessDto) {
        Business.Builder builder = new Business.Builder();
        if(businessDto.getName() == null || this.name.equals(businessDto.getName())) {
            builder.name(this.name);
        } else {
            builder.name(businessDto.getName());
        }

        if(businessDto.getPassword() == null || this.password.equals(businessDto.getPassword())) {
            builder.password(this.password);
        } else {
            builder.password(businessDto.getPassword());
        }

        if(businessDto.getEmail() == null || this.email.equals(businessDto.getEmail())) {
            builder.email(this.email);
        } else {
            builder.email(businessDto.getEmail());
        }

        if(businessDto.getBusinessNumber() == null || this.businessNumber.equals(businessDto.getBusinessNumber())) {
            builder.businessNumber(this.businessNumber);
        } else {
            builder.businessNumber(businessDto.getBusinessNumber());
        }

        if(businessDto.getStatus() == null || this.statusEnum.equals(businessDto.getStatus())) {
            builder.statusEnum(this.statusEnum);
        } else {
            builder.statusEnum(businessDto.getStatus());
        }

        return builder.build();
    }

}