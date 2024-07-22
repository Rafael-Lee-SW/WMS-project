package com.a508.wms.domain;

import com.a508.wms.domain.util.BaseTimeEntity;
import com.a508.wms.dto.BusinessDto;
import com.a508.wms.util.constant.StatusEnum;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

import lombok.*;

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

    /**
     * BusinessDto 객체를 받아서 변경할 정보는 입력하고 기존 정보는 유지하여 Business 객체로 변경해주는 메서드
     *
     * @param businessDto
     * @return Business
     */
    public Business toBusiness(BusinessDto businessDto) {
        return Business.builder()
                .id(this.id)  // id를 유지
                .name(businessDto.getName() == null ? this.name : businessDto.getName())
                .password(businessDto.getPassword() == null ? this.password : businessDto.getPassword())
                .email(businessDto.getEmail() == null ? this.email : businessDto.getEmail())
                .businessNumber(businessDto.getBusinessNumber() == null ? this.businessNumber : businessDto.getBusinessNumber())
                .statusEnum(businessDto.getStatus() == null ? this.statusEnum : businessDto.getStatus())
                .employees(this.employees) // 기존 직원 목록 유지
                .productDetails(this.productDetails) // 기존 제품 상세 목록 유지
                .notifications(this.notifications) // 기존 알림 목록 유지
                .subscriptions(this.subscriptions) // 기존 구독 목록 유지
                .warehouses(this.warehouses) // 기존 창고 목록 유지
                .build();
    }
}