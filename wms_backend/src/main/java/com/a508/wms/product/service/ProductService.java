package com.a508.wms.product.service;

import com.a508.wms.business.domain.Business;
import com.a508.wms.business.service.BusinessModuleService;
import com.a508.wms.floor.domain.Floor;
import com.a508.wms.floor.service.FloorModuleService;
import com.a508.wms.product.domain.Product;
import com.a508.wms.product.dto.ProductExportRequestDto;
import com.a508.wms.product.dto.ProductExportResponseDto;
import com.a508.wms.product.dto.ProductImportDto;
import com.a508.wms.product.dto.ProductPickingDto;
import com.a508.wms.product.dto.ProductPickingLocationDto;
import com.a508.wms.product.dto.ProductQuantityDto;
import com.a508.wms.product.dto.ProductRequestDto;
import com.a508.wms.product.dto.ProductResponseDto;
import com.a508.wms.product.mapper.ProductMapper;
import com.a508.wms.productdetail.domain.ProductDetail;
import com.a508.wms.productdetail.mapper.ProductDetailMapper;
import com.a508.wms.productdetail.repository.ProductDetailRepository;
import com.a508.wms.productdetail.service.ProductDetailModuleService;
import com.a508.wms.util.constant.StatusEnum;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductModuleService productModuleService;
    private final ProductDetailModuleService productDetailModuleService;
    private final FloorModuleService floorModuleService;
    private final BusinessModuleService businessModuleService;
    private final ProductDetailRepository productDetailRepository;

    /**
     * 서비스의 모든 상품을 반환하는 기능
     *
     * @return
     */
    public List<ProductResponseDto> findAll() {
        final List<Product> products = productModuleService.findAll();

        return products.stream()
            .map(ProductMapper::fromProduct)
            .toList();
    }


    /**
     * 특정 상품을 반환하는 기능
     *
     * @param id 상품(Product)의 id
     * @return
     */
    public ProductResponseDto findById(Long id) {
        Product product = productModuleService.findById(id);

        return ProductMapper.fromProduct(product);
    }

    /**
     * 특정 상품정보에 해당하는 상품들을 반환하는 기능
     *
     * @param productDetailId 상품정보(ProductDetail) id
     * @return
     */
    public List<ProductResponseDto> findByProductDetailId(Long productDetailId) {
        final List<Product> products = productModuleService.findByProductDetailId(productDetailId);

        return products.stream()
            .map(ProductMapper::fromProduct)
            .toList();
    }

    /**
     * 특정 사업자에 해당하는 상품들을 반환하는 기능
     *
     * @param businessId 사업자(Business) id
     * @return
     */

    public List<ProductResponseDto> findByBusinessId(Long businessId) {
        final List<Product> products = productModuleService.findByBusinessId(businessId);

        return products.stream()
            .map(ProductMapper::fromProduct)
            .toList();
    }

    /**
     * 창고 id에 해당하는 상품들을 반환하는 기능
     *
     * @param warehouseId 창고(Warehouse)의 id
     * @return
     */
    public List<ProductResponseDto> findByWarehouseId(Long warehouseId) {
        final List<Product> products = productModuleService.findByWarehouseId(warehouseId);
        return products.stream()
            .map((product) ->
                {
                    ProductResponseDto productResponseDto = ProductMapper.fromProduct(product);
                    productResponseDto.setFloorLevel(product.getFloor().getFloorLevel());
                    productResponseDto.setLocationName(product.getFloor().getLocation().getName());

                    return productResponseDto;
                }
            )
            .toList();
    }

    @Transactional
    public List<ProductResponseDto> findByLocationId(Long locationId) {
        final List<Product> products = productModuleService.findByLocationId(locationId);
        return products.stream()
            .map((product) ->
                {
                    ProductResponseDto productResponseDto = ProductMapper.fromProduct(product);
                    productResponseDto.setFloorLevel(product.getFloor().getFloorLevel());
                    productResponseDto.setLocationName(product.getFloor().getLocation().getName());

                    return productResponseDto;
                }
            )
            .toList();
    }

//    /**
//     * ProductDetail값을 통해 Product를 저장하는 기능
//     *
//     * @param request: Product 데이터
//     */
//    public void save(ProductRequestDto request) {
//        ProductDetail productDetail = productDetailModuleService.findById(
//            request.getProductDetailId());
//
//        productModuleService.save(request, productDetail);
//    }

    /**
     * 기존 상품 데이터를 조회하여 수정하는 기능
     *
     * @param id      상품 id
     * @param request 수정할 상품 데이터
     */
    public void update(Long id, ProductRequestDto request) {
        Product product = productModuleService.findById(id);

        product.updateData(
            (request.getProductQuantity() == -1) ? product.getProductQuantity()
                : request.getProductQuantity(),
            (request.getExpirationDate() == null) ? product.getExpirationDate()
                : request.getExpirationDate(),
            (request.getComment() == null) ? product.getComment() : request.getComment()
        );

        productModuleService.save(product);
    }

    /**
     * 상품의 상태값을 삭제로 변경, 해당 상품에 해당하는 모든 상품 로케이션 또한 변경.
     *
     * @param id 상품의 id
     */
    @Transactional
    public void delete(Long id) {
        Product product = productModuleService.findById(id);

        product.updateStatus(StatusEnum.DELETED);

        productModuleService.save(product);
    }

    /**
     * 상품들의 입고처리를 수행함.
     *
     * @param requests
     */
    @Transactional
    public void importProducts(List<ProductImportDto> requests) {
        log.info("Importing products");
        Long warehouseId = requests.get(0).getWarehouseId();

        //입력된 창고에 정의된 default floor
        Floor defaultFloor = floorModuleService.findByWarehouseIdAndLevel(warehouseId, -1);

        log.info("default floor Id: {}", defaultFloor.getId());

        for (ProductImportDto request : requests) {
            importProduct(request, defaultFloor);
            log.info("finish save product");
        }
    }

    /**
     * 한 상품의 입고처리를 수행함 입고로 들어온 상품이 DB에 있는지 확인한다. 상품의 동등성 판단은 상품 정보 id와 유톻기한으로 한다. 있다면 해당 상품의 총 수량을
     * 입고량만큼 추가해준다. 없다면 새로 상품을 추가한다.
     *
     * @param request
     * @param defaultFloor: 입고 처리 된 상품이 들어가는 default 층
     */
    private void importProduct(ProductImportDto request, Floor defaultFloor) {
        log.info("Importing product");

        ProductDetail productDetail = findOrCreateProductDetail(request);
        Product product = findProduct(request.getProduct(), productDetail);
        product.updateFloor(defaultFloor);
        productModuleService.save(product);
    }

    /**
     * 저장하려는 상품정보가 현재 DB에 있는지 확인하고 없으면 추가하는 기능
     *
     * @param request
     * @return
     */
    private ProductDetail findOrCreateProductDetail(ProductImportDto request) {
        Optional<ProductDetail> optionalProductDetail = productDetailModuleService.findByBusinessIdAndBarcode(
            request.getBusinessId(), request.getProductDetail().getBarcode());

        if (optionalProductDetail.isPresent()) {
            log.info("Found product detail: {}", optionalProductDetail.get());
            return optionalProductDetail.get();
        }

        log.info("not found product detail");

        request.getProductDetail().setBusinessId(request.getBusinessId());

        //없으면 ProductDetail을 새로 만들어야함.
        Business business = businessModuleService.findById(request.getBusinessId());
        ProductDetail productDetail = ProductDetailMapper.fromDto(request.getProductDetail());

        productDetail.setBusiness(business);
        return productDetailModuleService.save(productDetail);
    }

    /**
     * 해당 상품이 있는지 확인하고 없다면 새로 만들어서 반환해주는 기능.
     *
     * @param request       : 입력된 상품 data
     * @param productDetail : 상품 정보
     * @return
     */

    private Product findProduct(ProductRequestDto request, ProductDetail productDetail) {
        log.info("find productDetail: {}", request);

        Optional<Product> optionalProduct = productModuleService.findByIdAndExpirationDate(
            productDetail.getId(), request.getExpirationDate());

        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();

            product.updateData(
                product.getProductQuantity() + request.getProductQuantity(),
                product.getExpirationDate(), product.getComment());

            return product;
        }

        return Product.builder()
            .productDetail(productDetail)
            .productQuantity(request.getProductQuantity())
            .expirationDate(request.getExpirationDate())
            .comment(request.getComment())
            .build();
    }

    /**
     * 물품들의 출고 판단 및 처리를 하는 기능
     *
     * @param requests
     * @return
     */
    @Transactional
    public List<ProductExportResponseDto> exportProducts(List<ProductExportRequestDto> requests) {
        //재고 확인
        productQuantityCheck(requests);

        //경로 처리 및 수량 반영

        //송장번호별로 데이터를 묶음.
        Map<Long, List<ProductExportRequestDto>> exports = requests.stream()
            .collect(Collectors.groupingBy((ProductExportRequestDto::getTrackingNumber)));

        log.info("exports Size: {}", exports.size());
        //송장별로 처리
        List<ProductExportResponseDto> result = exports.entrySet().stream()
            .map(entry -> {
                Map<String, List<ProductPickingDto>> path = calculatePath(entry.getValue());
                return ProductExportResponseDto.builder()
                    .trackingNumber(entry.getKey())
                    .path(path)
                    .build();
            }).toList();

        log.info("result: {}", result);

        return result;
    }

    /**
     * 각 송장별 출고 처리를 진행하여 결과 경로를 반환하는 기능
     *
     * @param invoice : 한 송장의 출고 상품 내역 정보
     * @return
     */
    private Map<String, List<ProductPickingDto>> calculatePath(
        List<ProductExportRequestDto> invoice) {
        Map<String, List<ProductPickingDto>> path = new HashMap<>();
        for (ProductExportRequestDto exportProduct : invoice) {
            //목적 상품에 해당하는 모든 로케이션 data
            List<ProductPickingLocationDto> candidates = productModuleService.findPickingLocation(
                exportProduct.getBarcode(), exportProduct.getBusinessId());

            //남은양
            int remains = exportProduct.getQuantity();

            log.info("candidates Size: {}", candidates.size());
            log.info("remains:{}", remains);

            for (ProductPickingLocationDto candidate : candidates) {
                if (candidate.getProductQuantity() == 0) {
                    continue;
                }

                if (candidate.getProductQuantity() >= remains) {
                    //candidate의 값을 remain 뺀 값으로 만들기.
                    updateProductQuantity(candidate.getProductId(),
                        candidate.getProductQuantity() - remains);
                    //path에 추가
                    List<ProductPickingDto> pickings = path.getOrDefault(
                        candidate.getWarehouseName(), new ArrayList<>());

                    pickings.add(ProductPickingDto.builder()
                        .locationName(candidate.getLocationName())
                        .floorLevel(candidate.getFloorLevel())
                        .productName(candidate.getProductName())
                        .amount(candidate.getProductQuantity() - remains)
                        .build());

                    path.put(candidate.getWarehouseName(), pickings);
                    break;
                }

                remains -= candidate.getProductQuantity();

                //candidate의 값을 0으로 만들기.
                updateProductQuantity(candidate.getProductId(), 0);

                //path에 추가
                List<ProductPickingDto> pickings = path.getOrDefault(
                    candidate.getWarehouseName(), new ArrayList<>());

                pickings.add(ProductPickingDto.builder()
                    .locationName(candidate.getLocationName())
                    .floorLevel(candidate.getFloorLevel())
                    .productName(candidate.getProductName())
                    .amount(0)
                    .build());

                path.put(candidate.getWarehouseName(), pickings);
            }
        }

        return path;
    }

    /**
     * 출고되는 물품의 수량을 변경하는 로직
     *
     * @param productId
     * @param quantity
     */

    private void updateProductQuantity(Long productId, int quantity) {
        log.info("quantity:{}", quantity);
        Product product = productModuleService.findById(productId);

        product.updateData(quantity, product.getExpirationDate(), product.getComment());

        productModuleService.save(product);
    }

    /**
     * 현제 출고 명령이 재고상 가능한 상태인지 판단해주는 기능,예외처리 안되면 출고 가능
     *
     * @param requests
     */
    private void productQuantityCheck(List<ProductExportRequestDto> requests) {
        Long businessId = requests.get(0).getBusinessId();
        //각 물품별 총합
        Map<Long, Integer> productTotalCount = requests.stream().collect(
            Collectors.groupingBy((ProductExportRequestDto::getBarcode),
                Collectors.summingInt(ProductExportRequestDto::getQuantity)));

        //물품별 총 재고에 따른 타입 분류 (나중에 Integer를 Enum으로 바꿔도 좋을듯)
        Map<Long, Integer> productQuantityResult = productTotalCount.entrySet().stream()
            .collect(Collectors.toMap(Map.Entry::getKey,
                entry -> calculateProductQuantity(entry.getKey(), entry.getValue(), businessId)));

        //불가능 하나라도 있으면 에러 반환
        if (containsImpossibleExportProduct(productQuantityResult)) {
            throw new IllegalArgumentException("수량 부족");
        }

        //재고 이동해야 하는 물품들 확인
        List<Long> movingProductBarcodes = new ArrayList<>();

        productQuantityResult.entrySet().stream()
            .filter(entry -> entry.getValue() == 1)
            .forEach(entry -> movingProductBarcodes.add(entry.getKey()));

        if (!movingProductBarcodes.isEmpty()) {
            throw new IllegalArgumentException(
                "해당 물품들의 이동이 필요합니다." + movingProductBarcodes);
        }
    }

    /**
     * 전체 재고량이 부족하여 출고가 불가능한 경우가 있는지 확인하는 기능.
     *
     * @param productQuantityResult
     * @return
     */
    private boolean containsImpossibleExportProduct(Map<Long, Integer> productQuantityResult) {
        return productQuantityResult.entrySet().stream()
            .anyMatch(entry -> entry.getValue() == 2);
    }

    /**
     * 각 물품별 재고에 따른 출고 가능 여부를 확인하여 매핑해주는 기능.
     *
     * @param barcode
     * @param quantity
     * @param businessId
     * @return
     */
    private Integer calculateProductQuantity(Long barcode, Integer quantity, Long businessId) {
        //매장+전시의 총합과 보관의 총합이 들어있는 게산 결과 반환.
        ProductQuantityDto productQuantityDto = productModuleService.findProductQuantityByBarcodeAndBusinessId(
            barcode, businessId);

        if (productQuantityDto.getPossibleQuantity() >= quantity) {
            return 0; //추가 명령 처리 x
        }

        if (productQuantityDto.getPossibleQuantity() +
            productQuantityDto.getMovableQuantity() >= quantity) {
            return 1; //보충 처리
        }

        return 2; //처리 불가.
    }
}
