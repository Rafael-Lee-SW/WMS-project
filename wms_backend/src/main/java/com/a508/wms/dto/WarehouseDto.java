package com.a508.wms.dto;


import com.a508.wms.domain.Warehouse;
import com.a508.wms.util.constant.FacilityTypeEnum;
import com.a508.wms.util.constant.StatusEnum;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class WarehouseDto {

    private Long id;
    private Long businessId;
    private int size;
    private String name;
    private int rowCount;
    private int columnCount;
    private int priority;
    private FacilityTypeEnum facilityType;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;
    private StatusEnum status;
    private List<LocationDto> locations;


}