package com.a508.wms.productlocation.service;

import com.a508.wms.floor.domain.Floor;
import com.a508.wms.floor.service.FloorModuleService;
import com.a508.wms.location.service.LocationModuleService;
import com.a508.wms.productlocation.domain.ProductLocation;
import com.a508.wms.productlocation.dto.ProductLocationRequestDto;
import com.a508.wms.productlocation.dto.ProductLocationResponseDto;
import com.a508.wms.productlocation.mapper.ProductLocationMapper;
import com.a508.wms.util.constant.ExportTypeEnum;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductLocationService {

    private final ProductLocationModuleService productLocationModuleService;
    private final FloorModuleService floorModuleService;
    private final LocationModuleService locationModuleService;

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
        List<ProductLocation> productLocations = productLocationModuleService.findByProductId(
            productId);

        return ProductLocationMapper.fromProductLocations(productLocations);
    }

    /**
     * floorId가 동일한 상품을 productLocation 테이블에서 찾아서 반환
     *
     * @param floorId : floor table의 id
     * @return ProdutLocationResponseDto
     */
    public List<ProductLocationResponseDto> findByFloorId(Long floorId) {
        List<ProductLocation> productLocations = productLocationModuleService.findByFloorId(
            floorId);

        return ProductLocationMapper.fromProductLocations(productLocations);
    }

    /**
     * id가 동일한 상품을 productLocation 테이블에서 찾아서 반환
     *
     * @param productLocationId
     * @return ProdutLocationResponseDto
     */
    public ProductLocationResponseDto findById(long productLocationId) {
        ProductLocation productLocation = productLocationModuleService.findById(productLocationId);

        return ProductLocationMapper.fromProductLocation(productLocation);
    }

    /**
     * barcode가 동일한 상품을 productLocation 테이블에서 찾아서 반환
     *
     * @param barcode
     * @return List<ProductLocationResponseDto>
     */
    public List<ProductLocationResponseDto> findByBarcode(long barcode) {
        List<ProductLocation> productLocations = productLocationModuleService.findByBarcode(
            barcode);

        return ProductLocationMapper.fromProductLocations(productLocations);
    }

    /**
     *
     * @param original 기존 데이터베이스의 수량
     * @param input 사용자가 입력한 수량
     * @return 기존 수량 - 사용자 수량
     */
    public int calculateProductQuantity(int original, int input) {
        return original - input;
    }

    /**
     * 상품이 이동 가능한지 여부를 반환
     * @param original 기존 데이터베이스의 수량
     * @param input 사용자가 입력한 수량
     * @return 기존 수량 - 사용자 수량 >= 0이면 true, <0이면 false
     */
    public boolean isMoveProduct(int original, int input) {
        return input > 0 && calculateProductQuantity(original, input) >= 0;
    }

    /**
     * 특정 로케이션명과 층수가 있는 경우 이동할 Floor 객체를, 아니면 null을 반환
     * @param name 로케이션 이름
     * @param level 해당 로케이션에서 옮길 층수
     * @return 있는 경우 해당 Floor 객체, 아니면 null
     */
    public Floor updateFloor(String name, int level) {
        if (name != null && level >= 0) {
//                locationName을 가지고 locationid를 조회하고 floor에서 floorlevel = level이고 locationid = floor.locationid인거 찾기
            long locationId = locationModuleService.findByName(name).getId();
            return floorModuleService.findByLocationIdAndFloorLevel(
                    locationId, level);

        } else {
            return null;
        }
    }

    /**
     * 상품의 위치를 이동 productLocationRequestDto에서 입력받은 productLocationId를 기반으로 찾는다. 1. 바코드를 입력하면
     * findByBarcode를 호출해서 리스트를 넘겨주고, 유저가 그중 하나를 선택 2. 하나를 선택했을 때 update를 호출하고 변경할 상품의 수량을 입력. 3. 만약
     * 다른 곳에 이동하고 싶은 경우에는 locationName(oo-oo)과 floor의 floor_level을 입력받기
     *
     * @param productLocationRequestDto
     * @return 새로 추가된 productLocationResponseDto
     */
    @Transactional
    public ProductLocationResponseDto update(ProductLocationRequestDto productLocationRequestDto) {
        log.info("productLocationRequestDto: {}", productLocationRequestDto);
        ProductLocation productLocation = productLocationModuleService.findById(
            productLocationRequestDto.getId());
        int original = productLocation.getProduct_quantity();
        int input = productLocationRequestDto.getProductQuantity();

//        2. if(현재 상품 로케이션의 재고 개수가 더 많은 경우)사용자가 원하는 개수만큼의 재고를 가진 데이터 추가
        if (isMoveProduct(original, input)) {

            Floor floor = updateFloor(productLocationRequestDto.getLocationName(),
                    productLocationRequestDto.getFloorLevel());

//            기존거 업데이트
            int quantity = calculateProductQuantity(original, input);
            productLocation.setProductQuantity(quantity);
            productLocationModuleService.save(productLocation);

//            새거 추가
            int newQuantity = productLocationRequestDto.getProductQuantity();
            ProductLocation newProductLocation = ProductLocation.builder()
                    .floor((floor == null) ? productLocation.getFloor() : floor)
                    .product(productLocation.getProduct())
                    .product_quantity(newQuantity)
                    .exportTypeEnum((productLocationRequestDto.getExportTypeEnum()))
                    .build();

            return ProductLocationMapper.fromProductLocation(
                    productLocationModuleService.save(newProductLocation)
            );
        }
//        TODO:재고 이동에 실패할 경우 리턴 뭐 할지 생각하기
        else {
            return null;
        }
    }
}