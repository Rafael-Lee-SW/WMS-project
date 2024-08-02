package com.a508.wms.product.dto;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@ToString
public class ProductImportResponseDto {

    private List<ImportResponseDto> data;
    private LocalDateTime date;
    private long id;
}
