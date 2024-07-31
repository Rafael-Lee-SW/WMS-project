package com.a508.wms.user.domain;

import com.a508.wms.business.domain.Business;
import com.a508.wms.util.BaseTimeEntity;
import com.a508.wms.util.constant.RoleTypeEnum;
import com.a508.wms.util.constant.LoginTypeEnum;
import com.a508.wms.util.constant.StatusEnum;
import jakarta.persistence.*;
import java.sql.Timestamp;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "user")
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(nullable = false, length = 255, unique = true)
    private String password;

    @Column(length = 20)
    private String name;

    @Column(length = 50)
    private String nickname;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('GENERAL', 'EMPLOYEE', 'BUSINESS') DEFAULT 'GENERAL'")
    private RoleTypeEnum roleTypeEnum;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('GENERAL', 'KAKAO', 'NAVER') DEFAULT 'GENERAL'")
    private LoginTypeEnum loginTypeEnum;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('ACTIVE', 'DELETED', 'INACTIVE')")
    private StatusEnum statusEnum;

    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY)
    private Business business;

    // 연관 관계 편의 메서드
    public void setBusiness(Business business) {
        this.business = business;
        if (business != null) {
            business.setUser(this);
        }
    }

    public void setStatusEnum(StatusEnum statusEnum) {
        this.statusEnum = statusEnum;
    }

}
