package com.a508.wms.domain;

import com.a508.wms.domain.util.BaseTimeEntity;
import com.a508.wms.util.Status;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Warehouse extends BaseTimeEntity {

    @Id
    private Long id;

    @JoinColumn(name="business_id")
    @ManyToOne
    private Business business;

    @Column
    private int size;

    @Column
    private String name;

    @Column
    private int rowCount;

    @Column
    private int columnCount;

    @Column
    private int priority;

    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;

}
