package com.a508.wms.product.dto;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@ToString
@Data
public class ProductImportResponseDto {
    private List<ImportResponseDto> data;
    private LocalDateTime date;
    private long id;
}
