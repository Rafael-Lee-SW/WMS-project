package com.a508.wms.controller;

import com.a508.wms.controller.response.BaseExceptionResponse;
import com.a508.wms.controller.response.BaseSuccessResponse;
import com.a508.wms.domain.ProductLocation;
import com.a508.wms.dto.ProductLocationRequestDto;
import com.a508.wms.dto.ProductLocationResponseDto;
import com.a508.wms.service.ProductLocationService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/productlocations")
public class ProductLocationController {
    private static final Logger log = LoggerFactory.getLogger(ProductLocationController.class);
    private final ProductLocationService productLocationService;
    @GetMapping
    public BaseSuccessResponse<?> getProductLocation(@RequestParam(value = "productid", required = false) Long productId,
                                                     @RequestParam(value = "floorid", required = false) Long floorId,
                                                     @RequestParam(value = "id", required = false) Long id,
                                                     @RequestParam(value = "barcode", required = false) Long barcode) throws BaseExceptionResponse {
        try {
            if (productId != null) {
                log.info("get productLocation By productId {}", productId);
                return new BaseSuccessResponse<>(productLocationService.findByProductId(productId));
            } else if (floorId != null) {
                log.info("get productLocation By floorId {}", floorId);
                return new BaseSuccessResponse<>(productLocationService.findByFloorId(floorId));
            } else if (id != null) {
                log.info("get productLocation By id {}", id);
                return new BaseSuccessResponse<>(productLocationService.findById(id));
            } else if (barcode != null) {
                log.info("get productLocation By barcode {}", barcode);
                return new BaseSuccessResponse<>(productLocationService.findByBarcode(barcode));
            } else {
                throw new BaseExceptionResponse(false, 404, 404, "error");
            }
        } catch (Exception e) {
            throw new BaseExceptionResponse(false,500,500,"ISE");
        }
    }
    @PatchMapping
    public BaseSuccessResponse<?> updateProductLocation(@RequestBody ProductLocationRequestDto productLocationRequestDto) {
        log.info("update productLocation {}", productLocationRequestDto);
        return new BaseSuccessResponse<>(productLocationService.update(productLocationRequestDto));
    }
}
