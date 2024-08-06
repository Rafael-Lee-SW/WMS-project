package com.a508.wms.product.controller;


import com.a508.wms.notification.dto.NotificationResponseDto;
import com.a508.wms.product.dto.*;
import com.a508.wms.product.service.ExportModuleService;
import com.a508.wms.product.service.ImportModuleService;
import com.a508.wms.product.service.ProductService;
import com.a508.wms.util.BaseSuccessResponse;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final ImportModuleService importModuleService;
    private final ExportModuleService exportModuleService;

    /**
     * (서비스 전체/창고 별/상품 정보별)로의 상품들을 반환하는 기능
     *
     * @param warehouseId     창고 id
     * @param productDetailId 상품정보 id
     * @param locationId      로케이션 id
     * @return
     */
    @GetMapping
    public BaseSuccessResponse<List<?>> getProducts(
        @RequestParam(required = false) Long warehouseId,
        @RequestParam(required = false) Long productDetailId,
        @RequestParam(required = false) Long locationId) {
        if (warehouseId != null) {
            log.info("[Controller] find Products by warehouseId: {}", warehouseId);
            return new BaseSuccessResponse<>(productService.findByWarehouseId(warehouseId));
        } else if (productDetailId != null) {
            log.info("[Controller] find Products by productDetailId: {}", productDetailId);
            return new BaseSuccessResponse<>(productService.findByProductDetailId(productDetailId));
        } else if (locationId != null) {
            log.info("[Controller] find Products by LocationId: {}", locationId);
            return new BaseSuccessResponse<>(productService.findByLocationId(locationId));
        } else {
            log.info("[Controller] find Products");
            return new BaseSuccessResponse<>(productService.findAll());
        }
    }

    /**
     * 특정 상품을 조회하는 기능
     *
     * @param id 상품 id
     * @return
     */
    @GetMapping("/{id}")
    public BaseSuccessResponse<ProductMainResponseDto> getProduct(@PathVariable Long id) {
        log.info("[Controller] find Product by id: {}", id);
        return new BaseSuccessResponse<>(productService.findById(id));
    }

    /**
     * 상품을 수정하는 기능
     *
     * @param id                상품 id
     * @param productUpdateRequestDto 수정할 상품 정보
     */
    @PutMapping("/{id}")
    public BaseSuccessResponse<Void> updateProduct(@PathVariable Long id,
        @RequestBody ProductUpdateRequestDto productUpdateRequestDto) {
        log.info("[Controller] update Product by id: {}", id);
        productService.update(id, productUpdateRequestDto);

        return new BaseSuccessResponse<>(null);
    }


    /**
     * 상품의 상태값 변경을 통해 삭제하는 기능.
     *
     * @param id: 상품의 id
     */
    @PatchMapping("/{id}")
    public BaseSuccessResponse<Void> deleteProduct(@PathVariable Long id) {
        log.info("[Controller] delete Product by id: {}", id);
        productService.delete(id);

        return new BaseSuccessResponse<>(null);
    }

    /**
     * 입고 명령을 처리하는 기능
     * TODO: 입력 파라미터와 메서드의 파라미터가 일치하지 않아 차후수정 필요
     * TODO: 입력 없을 때 리턴타입 정하기
     *
     * @param date
     * @param businessId
     * @return
     */
    @GetMapping("/import")
    public BaseSuccessResponse<List<ImportResponseDto>> getImports(
        @RequestParam(value = "date", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
        @RequestParam Long businessId
    ) {
        if (businessId != null) {
            log.info("[Controller] find Imports by businessId: {}", businessId);
            if (date != null) {
                log.info("[Controller] find Imports by businessId and date: {},{}", businessId,
                    date);
//                return new BaseSuccessResponse<>(importModuleService.findAllByBusinessIdAndDate(businessId, date));
                return null;
            } else {
                return new BaseSuccessResponse<>(
                    importModuleService.findAllByBusinessId(businessId));
            }
        } else {
            return null;
        }
    }

    /**
     * 물품들의 입고처리를 수행하는 기능
     *
     * @param productImportRequestDto 입고되는 상품의 정보(엑셀의 한 row)
     * @return
     */
    @PostMapping("/import")
    public BaseSuccessResponse<Void> importProducts(
        @RequestBody ProductImportRequestDto productImportRequestDto
    ) {
        log.info("[Controller] create Imports by productImportRequestDto: {}",
            productImportRequestDto);
        productService.importProducts(productImportRequestDto);
        return new BaseSuccessResponse<>(null);
    }

    /**
     * 물품들의 출고 처리를 하는 로직
     *
     * @param exportProduct 출고되는 상품의 정보(엑셀의 한 row)
     * @return
     */

    @PostMapping("/export")
    public BaseSuccessResponse<List<ProductExportResponseDto>> exportProducts(
        @RequestBody ProductExportRequestDto exportProduct
    ) {
        log.info("[Controller] create Exports by ProductExportRequestDto: {}",
            exportProduct);
        return new BaseSuccessResponse<>(productService.exportProducts(exportProduct));
    }

    /**
     * 사업체에 대한 출고 내역을 조회하는 기능
     *
     * @param businessId 사업체의 id
     * @return
     */
    @GetMapping("/export")
    public BaseSuccessResponse<List<ExportResponseDto>> findAllExportsByBusinessId(
        @RequestParam Long businessId) {
        if (businessId != null) {
            log.info("[Controller] find Exports by businessId: {}", businessId);
            return new BaseSuccessResponse<>(exportModuleService.findAllByBusinessId(businessId));
        }
        return null;
    }


    /**
     * 사업체에 대한 입,출고,유통기한 경고 상품 내역을 하나로 묶어서 반환하는 기능
     *
     * @param businessId 사업체의 id
     * @return
     */
    @GetMapping("/notification")
    public BaseSuccessResponse<NotificationResponseDto> findAllNotifications(
        @RequestParam Long businessId) {
        if (businessId != null) {
            log.info("[Controller] find Notifications by businessId: {}", businessId);
            return new BaseSuccessResponse<>(NotificationResponseDto.builder()
                .importResponseDtos(importModuleService.findAllByBusinessId(businessId))
                .exportResponseDtos(exportModuleService.findAllByBusinessId(businessId))
                .expirationProductResponseDtos(productService.findExpirationProducts(businessId))
                .build());
        }
        return null;
    }
}
