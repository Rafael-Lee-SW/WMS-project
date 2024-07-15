package com.a508.wms.domain;

import com.a508.wms.util.Status;
import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
@Table(name = "floor")
public class Floor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @Column(nullable = false)
    private int floorLevel;

    @Column(nullable = false)
    private int exportType;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;

    //연관관계 편의 메서드
    public void setLocation(Location location) {
        this.location = location;
        location.getFloors().add(this);
    }
}
