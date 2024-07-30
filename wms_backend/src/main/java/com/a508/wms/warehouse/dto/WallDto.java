package com.a508.wms.warehouse.dto;

import com.a508.wms.util.constant.StatusEnum;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@ToString
public class WallDto {

    private Long id;
    private int warehouseId;
    private int startX;
    private int startY;
    private int endX;
    private int endY;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private StatusEnum statusEnum;
}
