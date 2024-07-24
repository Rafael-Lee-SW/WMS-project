package com.a508.wms.product;

import com.a508.wms.floor.domain.Floor;
import com.a508.wms.floor.repository.FloorRepository;
import com.a508.wms.location.LocationRepository;
import com.a508.wms.util.constant.ExportTypeEnum;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductLocationService {
    private final ProductLocationRepository productLocationRepository;
    private final FloorRepository floorRepository;
    private final LocationRepository locationRepository;

    /**
     * productId가 동일한 상품을 productLocation 테이블에서 찾아서 반환
     *
     * @param productId
     * @return ProdutLocationResponseDto
     */
    public List<ProductLocationResponseDto> findByProductId(Long productId) {
        /*
         * 1. productLocationRepository에서 productId가 동일한 상품 찾기
         * 2. 해당 상품을 return
         */
        return ProductLocationMapper.fromProductLocations(productLocationRepository.findByProductId(productId));
    }

    /**
     * floorId가 동일한 상품을 productLocation 테이블에서 찾아서 반환
     *
     * @param floorId : floor table의 id
     * @return ProdutLocationResponseDto
     */
    public List<ProductLocationResponseDto> findByFloorId(Long floorId) {
        /*
         * 1. productLocationRepository에서 floorId가 동일한 상품 찾기
         * 2. 해당 상품 return
         */
        return ProductLocationMapper.fromProductLocations(productLocationRepository.findByFloorId(floorId));
    }

    /**
     * id가 동일한 상품을 productLocation 테이블에서 찾아서 반환
     *
     * @param id
     * @return ProdutLocationResponseDto
     */
    public ProductLocationResponseDto findById(long id) {
        return ProductLocationMapper.fromProductLocation(productLocationRepository.findById(id).orElseThrow(null));
    }

    /**
     * barcode가 동일한 상품을 productLocation 테이블에서 찾아서 반환
     * @param barcode
     * @return List<ProductLocationResponseDto>
     */
    public List<ProductLocationResponseDto> findByBarcode(long barcode) {
        return ProductLocationMapper.fromProductLocations(productLocationRepository.findByBarcode(barcode));
    }

    /**
     * 상품의 위치를 이동
     * productLocationRequestDto에서 입력받은 productLocationId를 기반으로 찾는다.
     * 1. 바코드를 입력하면 findByBarcode를 호출해서 리스트를 넘겨주고, 유저가 그중 하나를 선택
     * 2. 하나를 선택했을 때 update를 호출하고 변경할 상품의 수량을 입력.
     * 3. 만약 다른 곳에 이동하고 싶은 경우에는 locationName(oo-oo)과 floor의 floor_level을 입력받기
     * @param productLocationRequestDto
     * @return 새로 추가된 productLocationResponseDto
     */
    @Transactional
    public ProductLocationResponseDto update(ProductLocationRequestDto productLocationRequestDto) {
        log.info("productLocationRequestDto: {}", productLocationRequestDto);
        ProductLocation productLocation = productLocationRepository.findById(productLocationRequestDto.getId())
                .orElseThrow();
//        2. if(현재 상품 로케이션의 재고 개수가 더 많은 경우)사용자가 원하는 개수만큼의 재고를 가진 데이터 추가
        if (productLocationRequestDto.getProductQuantity() > 0 && productLocation.getProduct_quantity() >= productLocationRequestDto.getProductQuantity()) {
            ProductLocation.ProductLocationBuilder builder = ProductLocation.builder();

            int oldProductQuantity = productLocation.getProduct_quantity() - productLocationRequestDto.getProductQuantity();
            productLocation.setProductQuantity(oldProductQuantity);
            int newProductQuantity = productLocationRequestDto.getProductQuantity();
//            이동을 요청한 로케이션의 보관타입이 전시인 경우 매장,아니라면 전시로 이동
            ExportTypeEnum newExportTypeEnum = ExportTypeEnum.DISPLAY;
            if (productLocation.getExportTypeEnum() == ExportTypeEnum.DISPLAY) {
                newExportTypeEnum = ExportTypeEnum.STORE;
            }
//            사용자가 특정 로케이션에 입력하길 원하는 경우
            if (productLocationRequestDto.getLocationName() != null && productLocationRequestDto.getFloorLevel() > 0) {
//                locationName을 가지고 locationid를 조회하고 floor에서 floorlevel = level이고 locationid = floor.locationid인거 찾기
            long locationId = locationRepository.findLocationByName(
                    productLocationRequestDto.getLocationName()).getId();
            Floor floor = floorRepository.findByLocationIdAndFloorLevel(
                    locationId, productLocationRequestDto.getFloorLevel());
            builder.floor(floor);
            } else {
                builder.floor(productLocation.getFloor()); // 아니라면 기존의 floor 사용
            }
            builder.product_quantity(newProductQuantity);
            builder.exportTypeEnum(newExportTypeEnum);
            builder.product(productLocation.getProduct());
//            기존거 업데이트
            productLocationRepository.save(productLocation);
//            새거 추가
            ProductLocation updatedProductLocation = productLocationRepository.save(builder.build());
            return ProductLocationMapper.fromProductLocation(updatedProductLocation);
        }
//        TODO:재고 이동에 실패할 경우 리턴 뭐 할지 생각하기
        else return null;
    }
}