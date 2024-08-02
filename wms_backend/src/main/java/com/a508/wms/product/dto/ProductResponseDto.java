package com.a508.wms.product.dto;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

public class ProductResponseDto {

    @Getter
    @Builder
    @ToString
    public static class Info {

        private Long id;
        private int quantity;
        private LocalDateTime expirationDate;
        private String locationName;
        private int floorLevel;
    }

    @Getter
    @Builder
    @ToString
    public static class DetailedResponse {

        private Info info;
        private String name;
        private Long barcode;
    }
}
