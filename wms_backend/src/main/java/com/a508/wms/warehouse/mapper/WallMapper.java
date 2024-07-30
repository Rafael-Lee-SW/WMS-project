package com.a508.wms.warehouse.mapper;

import com.a508.wms.warehouse.domain.Wall;
import com.a508.wms.warehouse.dto.WallDto;
import org.springframework.stereotype.Component;

@Component
public class WallMapper {

    public static Wall fromDto(WallDto wallDto) {
        return Wall.builder()
            .id(wallDto.getId())
            .startX(wallDto.getStartX())
            .startY(wallDto.getStartY())
            .endX(wallDto.getEndX())
            .endY(wallDto.getEndY())
            .build();
    }

    public static WallDto fromWall(Wall wall) {
        return WallDto.builder()
            .id(wall.getId())
            .startX(wall.getStartX())
            .startY(wall.getStartY())
            .endX(wall.getEndX())
            .endY(wall.getEndY())
            .createdDate(wall.getCreatedDate())
            .updatedDate(wall.getUpdatedDate())
            .statusEnum(wall.getStatusEnum())
            .build();
    }

}
