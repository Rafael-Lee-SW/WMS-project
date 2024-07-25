package com.a508.wms.productlocation.service;

import com.a508.wms.productlocation.domain.ProductLocation;
import com.a508.wms.productlocation.repository.ProductLocationRepository;
import com.a508.wms.util.constant.StatusEnum;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductLocationModuleService {

    private final ProductLocationRepository productLocationRepository;


    /**
     * id가 동일한 상품을 productLocation 테이블에서 찾아서 반환
     *
     * @param productLocationId
     * @return ProdutLocationResponseDto
     */
    public ProductLocation findById(long productLocationId) {
        return productLocationRepository.findById(productLocationId)
            .orElseThrow(() -> new IllegalArgumentException(
                "Invalid Product Location ID " + productLocationId));
    }

    /**
     * productId가 동일한 상품을 productLocation 테이블에서 찾아서 반환
     *
     * @param productId
     * @return ProdutLocationResponseDto
     */
    public List<ProductLocation> findByProductId(Long productId) {
        return productLocationRepository.findByProductId(productId);
    }

    /**
     * floorId가 동일한 상품을 productLocation 테이블에서 찾아서 반환
     *
     * @param floorId : floor table의 id
     * @return ProdutLocationResponseDto
     */
    public List<ProductLocation> findByFloorId(Long floorId) {
        return productLocationRepository.findByFloorId(floorId);
    }

    /**
     * barcode가 동일한 상품을 productLocation 테이블에서 찾아서 반환
     *
     * @param barcode
     * @return List<ProductLocationResponseDto>
     */
    public List<ProductLocation> findByBarcode(long barcode) {
        return productLocationRepository.findByBarcode(barcode);
    }

    /**
     * 상품 로케이션을 저장하는 기능
     *
     * @param productLocation
     * @return
     */
    public ProductLocation save(ProductLocation productLocation) {
        return productLocationRepository.save(productLocation);
    }

    /**
     * 입력으로 들어온 모든 상품 로케이션을 저장하는 기능
     *
     * @param productLocations
     * @return
     */
    public List<ProductLocation> saveAll(List<ProductLocation> productLocations) {
        return productLocationRepository.saveAll(productLocations);
    }

    /**
     * 상품 로케이션을 soft delete하는 기능
     *
     * @param productLocation
     * @return
     */
    public ProductLocation delete(ProductLocation productLocation) {
        productLocation.updateStatus(StatusEnum.DELETED);
        return productLocationRepository.save(productLocation);
    }
}
