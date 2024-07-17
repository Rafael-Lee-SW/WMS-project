package com.a508.wms.domain;

import com.a508.wms.domain.util.BaseTimeEntity;
import com.a508.wms.dto.FloorDto;
import com.a508.wms.util.ExportTypeEnum;
import com.a508.wms.util.StatusEnum;
import jakarta.persistence.*;
import lombok.Getter;

import java.util.List;

@Entity
@Getter
@Table(name = "floor")
public class Floor extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @Column(nullable = false)
    private int floorLevel;

    @Column(nullable = false)
    private ExportTypeEnum exportTypeEnum = ExportTypeEnum.IMPORT;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusEnum statusEnum = StatusEnum.ACTIVE;

    @OneToMany(mappedBy = "floor")
    private List<ProductLocation> productLocations;

    //연관관계 편의 메서드
    public void setLocation(Location location) {
        this.location = location;
        location.getFloors().add(this);
    }

    public static Floor fromDto(FloorDto floorDto, Location location) {
        Floor floor = new Floor();
        floor.id = floorDto.getId();
        floor.setLocation(location);
        floor.floorLevel = floorDto.getFloorLevel();
        floor.exportTypeEnum = floorDto.getExportType();
        return floor;
    }

}
