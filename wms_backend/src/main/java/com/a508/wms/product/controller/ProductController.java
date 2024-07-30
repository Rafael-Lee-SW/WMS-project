package com.a508.wms.product.controller;


import com.a508.wms.product.dto.ProductExportRequestDto;
import com.a508.wms.product.dto.ProductExportResponseDto;
import com.a508.wms.product.dto.ProductImportDto;
import com.a508.wms.product.dto.ProductRequestDto;
import com.a508.wms.product.dto.ProductResponseDto;
import com.a508.wms.product.service.ProductService;
import com.a508.wms.util.BaseSuccessResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

//    /**
//     * 상품을 등록하는 기능
//     *
//     * @param productRequestDto: Product 데이터
//     */
//    @PostMapping
//    public BaseSuccessResponse<Void> createProduct(
//        @RequestBody ProductRequestDto productRequestDto) {
//        log.info("create product by productRequest: {}", productRequestDto);
//        productService.save(productRequestDto);
//
//        return new BaseSuccessResponse<>(null);
//    }

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
     * 물품들의 입고처리를 수행하는 기능
     *
     * @param importProducts: 입고되는 상품의 정보(엑셀의 한 row)
     * @return
     */
    @PostMapping("/import")
    public BaseSuccessResponse<Void> importProducts(
        @RequestBody List<ProductImportDto> importProducts
    ) {
        log.info("import products: {}", importProducts);

        productService.importProducts(importProducts);
        return new BaseSuccessResponse<>(null);
    }

    /**
     * 물품들의 출고 처리를 하는 로직
     *
     * @param exportProducts : 출고되는 상품의 정보(엑셀의 한 row)
     * @return
     */

    @PostMapping("/export")
    public BaseSuccessResponse<List<ProductExportResponseDto>> exportProducts(
        @RequestBody List<ProductExportRequestDto> exportProducts
    ) {
        log.info("export products: {}", exportProducts);
        return new BaseSuccessResponse<>(productService.exportProducts(exportProducts));
    }
}
