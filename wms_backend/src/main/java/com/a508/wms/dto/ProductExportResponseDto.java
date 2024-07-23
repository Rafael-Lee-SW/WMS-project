package com.a508.wms.dto;

import java.util.List;
import java.util.Map;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ProductExportResponseDto {

    private Long trackingNumber;
    private Map<String, List<ProductPickingDto>> path;
}
