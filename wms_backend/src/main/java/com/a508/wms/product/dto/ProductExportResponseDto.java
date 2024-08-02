package com.a508.wms.product.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
@ToString
public class ProductExportResponseDto {

    //    private List<ExportResponseDto> path;
//    private String warehouseName;
    private Map<String, List<ExportResponseDto>> path;
}
