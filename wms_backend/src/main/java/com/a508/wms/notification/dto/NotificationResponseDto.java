package com.a508.wms.notification.dto;

import com.a508.wms.product.dto.ExportResponseDto;
import com.a508.wms.product.dto.ImportResponseDto;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Builder
@Getter
@Setter
public class NotificationResponseDto {

    private List<ImportResponseDto> importResponseDtos;
    private List<ExportResponseDto> exportResponseDtos;
}
