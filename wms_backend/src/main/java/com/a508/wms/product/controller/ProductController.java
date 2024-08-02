package com.a508.wms.product.controller;


import com.a508.wms.notification.dto.NotificationResponseDto;
import com.a508.wms.product.dto.*;
import com.a508.wms.product.service.ExportModuleService;
import com.a508.wms.product.service.ImportModuleService;
import com.a508.wms.product.service.ProductService;
import com.a508.wms.util.BaseSuccessResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final ImportModuleService importModuleService;
    private final ExportModuleService exportModuleService;

    /**
     * (서비스 전체/사업자 별/창고 별/상품 정보별)로의 상품들을 반환하는 기능
     *
     * @param businessId      사업자 id
     * @param warehouseId     창고 id
     * @param productDetailId 상품정보 id
     * @return
     */
    @GetMapping
    public BaseSuccessResponse<List<ProductResponseDto>> getProducts(
            @RequestParam(required = false) Long businessId,
            @RequestParam(required = false) Long warehouseId,
            @RequestParam(required = false) Long productDetailId,
            @RequestParam(required = false) Long locationId) {
        if (businessId != null) {
            log.info("findProducts businessId: {}", businessId);
            return new BaseSuccessResponse<>(productService.findByBusinessId(businessId));
        } else if (warehouseId != null) {
            log.info("findProducts warehouseId: {}", warehouseId);
            return new BaseSuccessResponse<>(productService.findByWarehouseId(warehouseId));
        } else if (productDetailId != null) {
            log.info("findProducts productDetailId: {}", productDetailId);
            return new BaseSuccessResponse<>(productService.findByProductDetailId(productDetailId));
        } else if (locationId != null) {
            log.info("findProducts locationId: {}", locationId);
            return new BaseSuccessResponse<>(productService.findByLocationId(locationId));
        } else {
            log.info("findProducts");
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
    public BaseSuccessResponse<ProductResponseDto> getProduct(@PathVariable Long id) {
        log.info("find product by id: {}", id);
        return new BaseSuccessResponse<>(productService.findById(id));
    }

    /**
     * 상품을 수정하는 기능
     *
     * @param id                상품 id
     * @param productRequestDto 수정할 상품 정보
     */
    @PutMapping("/{id}")
    public BaseSuccessResponse<Void> updateProduct(@PathVariable Long id,
                                                   @RequestBody ProductRequestDto productRequestDto) {
        log.info("update product by id: {}", id);
        productService.update(id, productRequestDto);

        return new BaseSuccessResponse<>(null);
    }


    /**
     * 상품을 삭제하는 기능 -> 상품의 상태값을 삭제로 변경
     *
     * @param id: 상품의 id
     */
    @PatchMapping("/{id}")
    public BaseSuccessResponse<Void> deleteProduct(@PathVariable Long id) {
        log.info("delete product by id: {}", id);
        productService.delete(id);

        return new BaseSuccessResponse<>(null);
    }

    /**
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
            log.info("findImports businessId: {}", businessId);
            if (date != null) {
                log.info("findImports date: {}", date);
//                return new BaseSuccessResponse<>(importModuleService.findAllByBusinessIdAndDate(businessId, date));
                return null;
            } else {
                return new BaseSuccessResponse<>(importModuleService.findAllByBusinessId(businessId));
            }
        } else return null; // TODO: 입력 없을 때 리턴타입 정하기
    }

    /**
     * 물품들의 입고처리를 수행하는 기능
     *
     * @param productImportRequestDto: 입고되는 상품의 정보(엑셀의 한 row)
     * @return
     */
    @PostMapping("/import")
    public BaseSuccessResponse<Void> importProducts(
            @RequestBody ProductImportRequestDto productImportRequestDto
    ) {
        log.info("import products: {}", productImportRequestDto);
        productService.importProducts(productImportRequestDto);
        return new BaseSuccessResponse<>(null);
    }

    /**
     * 물품들의 출고 처리를 하는 로직
     *
     * @param exportProduct : 출고되는 상품의 정보(엑셀의 한 row)
     * @return
     */

    @PostMapping("/export")
    public BaseSuccessResponse<List<ProductExportResponseDto>> exportProducts(
            @RequestBody ProductExportRequestDto exportProduct
    ) {
        log.info("export products: {}", exportProduct);
        return new BaseSuccessResponse<>(productService.exportProducts(exportProduct));
    }

    @GetMapping("/export")
    public BaseSuccessResponse<List<ExportResponseDto>> findAllByBusinessId(@RequestParam Long businessId,
                                                                            @RequestParam(required = false) Long key) {
        if (businessId != null) {
            if (key != null) {
                log.info("findAllByBusinessId: {}", key);
            }
            log.info("findAllByBusinessId: {}", businessId);
            return new BaseSuccessResponse<>(exportModuleService.findAllByBusinessId(businessId));
        }
        return null;
    }

    @GetMapping("/notification")
    public BaseSuccessResponse<NotificationResponseDto> findAllNotifications(@RequestParam Long businessId) {
        if (businessId != null) {
            log.info("findAllByBusinessId: {}", businessId);
            return new BaseSuccessResponse<>(NotificationResponseDto.builder().importResponseDtos(importModuleService.findAllByBusinessId(businessId))
                    .exportResponseDtos(exportModuleService.findAllByBusinessId(businessId)).build());
        }
        return null;
    }
}
