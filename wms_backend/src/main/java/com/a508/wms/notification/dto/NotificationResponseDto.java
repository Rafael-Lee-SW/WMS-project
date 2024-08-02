package com.a508.wms.notification.dto;

import com.a508.wms.product.dto.ExportResponseDto;
import com.a508.wms.product.dto.ImportResponseDto;
import com.a508.wms.util.constant.StatusEnum;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

// id, businessId, date
// locationName, floor_level, productname, quantity = productpicking
@Builder
@Getter
@Setter
public class NotificationResponseDto {
    List<ImportResponseDto> importResponseDtos;
    List<ExportResponseDto> exportResponseDtos;
    private long id;
    private long businessId;
    private boolean readOrNot;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private StatusEnum statusEnum;
}
