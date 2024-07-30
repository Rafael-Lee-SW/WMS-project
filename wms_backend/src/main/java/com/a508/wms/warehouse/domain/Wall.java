package com.a508.wms.warehouse.domain;

import com.a508.wms.util.BaseTimeEntity;
import com.a508.wms.util.constant.StatusEnum;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Getter
@Builder
@ToString
@SQLRestriction("status_enum = 'Active'")
@RequiredArgsConstructor
@AllArgsConstructor
public class Wall extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @Column(nullable = false)
    private int startX;

    @Column(nullable = false)
    private int startY;

    @Column(nullable = false)
    private int endX;

    @Column(nullable = false)
    private int endY;

    @Column(nullable = false)
    private StatusEnum statusEnum = StatusEnum.ACTIVE;

    public void updateStatus(StatusEnum statusEnum) {
        this.statusEnum = statusEnum;
    }
}
