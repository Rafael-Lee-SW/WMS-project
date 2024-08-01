package com.a508.wms.notification.dto;

import com.a508.wms.product.dto.ExportResponseDto;
import com.a508.wms.product.dto.ImportResponseDto;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

// id, businessId, date
// locationName, floor_level, productname, quantity = productpicking
@Builder
@Getter
@Setter
public class NotificationResponseDto {
    @Builder.Default
    List<ImportResponseDto> importResponseDtos = new ArrayList<>();
    @Builder.Default
    List<ExportResponseDto> exportResponseDtos = new ArrayList<>();

}
