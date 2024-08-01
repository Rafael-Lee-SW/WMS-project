package com.a508.wms.product.service;

import com.a508.wms.business.domain.Business;
import com.a508.wms.business.service.BusinessModuleService;
import com.a508.wms.floor.domain.Floor;
import com.a508.wms.floor.service.FloorModuleService;
import com.a508.wms.notification.repository.NotificationRepository;
import com.a508.wms.notification.service.NotificationService;
import com.a508.wms.product.domain.Product;
import com.a508.wms.product.dto.ProductExportData;
import com.a508.wms.product.dto.ProductExportRequestDto;
import com.a508.wms.product.dto.ProductExportResponseDto;
import com.a508.wms.product.dto.ProductImportDto;
import com.a508.wms.product.dto.ProductImportRequestData;
import com.a508.wms.product.dto.ProductImportRequestDto;
import com.a508.wms.product.dto.ProductMainResponseDto;
import com.a508.wms.product.dto.ProductPickingLocationDto;
import com.a508.wms.product.dto.ProductQuantityDto;
import com.a508.wms.product.dto.ProductRequestDto;
import com.a508.wms.product.dto.ProductResponseDto;
import com.a508.wms.product.mapper.ProductMapper;
import com.a508.wms.product.repository.ProductRepository;
import com.a508.wms.productdetail.domain.ProductDetail;
import com.a508.wms.productdetail.dto.ProductDetailRequestDto;
import com.a508.wms.productdetail.mapper.ProductDetailMapper;
import com.a508.wms.productdetail.repository.ProductDetailRepository;
import com.a508.wms.productdetail.service.ProductDetailModuleService;
import com.a508.wms.util.constant.StatusEnum;
import jakarta.transaction.Transactional;
import java.time.LocalDate;
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
    private final NotificationService notificationService;
    private final NotificationRepository notificationRepository;
    private final ImportModuleService importModuleService;
    private final ProductRepository productRepository;

    /**
     * 서비스의 모든 상품을 반환하는 기능
     *
     * @return
     */
    public List<ProductMainResponseDto> findAll() {
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
    public ProductMainResponseDto findById(Long id) {
        Product product = productModuleService.findById(id);

        return ProductMapper.fromProduct(product);
    }

    /**
     * 특정 상품정보에 해당하는 상품들을 반환하는 기능
     *
     * @param productDetailId 상품정보(ProductDetail) id
     * @return
     */
    public List<ProductMainResponseDto> findByProductDetailId(Long productDetailId) {
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

    public List<ProductMainResponseDto> findByBusinessId(Long businessId) {
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
    public List<ProductResponseDto.DetailedResponse> findByWarehouseId(Long warehouseId) {
        final List<Product> products = productModuleService.findByWarehouseId(warehouseId);

        return products.stream()
            .map(ProductMapper::toProductInnerDetailResponseDto)
            .toList();
    }

    @Transactional
    public List<ProductMainResponseDto> findByLocationId(Long locationId) {
        final List<Product> products = productModuleService.findByLocationId(locationId);
        return products.stream()
            .map((product) ->
                {
                    ProductMainResponseDto productMainResponseDto = ProductMapper.fromProduct(product);
                    productMainResponseDto.setFloorLevel(product.getFloor().getFloorLevel());
                    productMainResponseDto.setLocationName(product.getFloor().getLocation().getName());

                    return productMainResponseDto;
                }
            )
            .toList();
    }

    /**
     * 기존 상품 데이터를 조회하여 수정하는 기능
     *
     * @param id      상품 id
     * @param request 수정할 상품 데이터
     */
    public void update(Long id, ProductRequestDto request) {
        Product product = productModuleService.findById(id);

        product.updateData(
            (request.getQuantity() == -1) ? product.getQuantity()
                : request.getQuantity(),
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
     * 상품들의 입고처리를 수행
     *
     * @param productImportRequestDto : dto
     */
    @Transactional
    public void importProducts(ProductImportRequestDto productImportRequestDto) {
        log.info("Importing products");
        Long warehouseId = productImportRequestDto.getWarehouseId();

        log.info("warehouseId : {}", warehouseId);
        //입력된 창고에 정의된 default floor
        Floor defaultFloor = floorModuleService.findDefaultFloorByWarehouse(warehouseId);

        log.info("default floor Id: {}", defaultFloor.getId());

        productImportRequestDto.getData()
            .forEach(data -> {
                importProduct(data, productImportRequestDto.getBusinessId(),
                    defaultFloor);
            });
    }

    /**
     * 한 상품의 입고처리를 수행함 입고로 들어온 상품이 DB에 있는지 확인한다. 상품의 동등성 판단은 상품 정보 id와 유톻기한으로 한다. 있다면 해당 상품의 총 수량을
     * 입고량만큼 추가해준다. 없다면 새로 상품을 추가한다. 추가: 입고 정보를 입고 테이블에 추가한다.
     *
     * @param request
     * @param defaultFloor: 입고 처리 된 상품이 들어가는 default 층
     */
    private void importProduct(ProductImportRequestData request, Long businessId,
        Floor defaultFloor) {
        log.info("Importing product");

        ProductDetail productDetail = findOrCreateProductDetail(request, businessId);
        Product product = ProductMapper.fromProductImportData(request, productDetail, defaultFloor);

        productModuleService.save(product);
        importModuleService.save(request, product);
    }

    /**
     * 저장하려는 상품정보가 현재 DB에 있는지 확인하고 없으면 추가하는 기능
     *
     * @param request
     * @return
     */
    private ProductDetail findOrCreateProductDetail(ProductImportRequestData request,
        Long businessId) {
        Optional<ProductDetail> optionalProductDetail = productDetailModuleService.findByBusinessIdAndBarcode(
            businessId, request.getBarcode());

        if (optionalProductDetail.isPresent()) {
            log.info("Found product detail: {}", optionalProductDetail.get());
            return optionalProductDetail.get();
        }

        log.info("not found product detail");
        log.info("request : {}", request);

        //없으면 ProductDetail을 새로 만들어야함.
        Business business = businessModuleService.findById(businessId);
        ProductDetail productDetail = ProductDetailMapper.fromProductImportData(request, business);

        return productDetailModuleService.save(productDetail);
    }

    /**
     * 물품들의 출고 판단 및 처리를 하는 기능
     *
     * @param request
     * @return
     */
    @Transactional
    public List<ProductExportResponseDto> exportProducts(ProductExportRequestDto request) {
        //재고 확인
        productQuantityCheck(request);

        //경로 처리 및 수량 반영
        List<ProductExportData> data = request.getData();
        //송장번호별로 데이터를 묶음.
        Map<String, List<ProductExportData>> exports = data.stream()
            .collect(Collectors.groupingBy(ProductExportData::getTrackingNumber));

        //송장별로 처리
        List<ProductExportResponseDto> result = exports.entrySet().stream()
            .map(entry -> {
                //송장별 창고별 path
                Map<String, List<ProductExportData>> path = calculatePath(entry.getValue(),
                    request.getBusinessId());
                return ProductExportResponseDto.builder()
                    .path(path)
                    .build();
            }).toList();

        return result;
    }

    /**
     * 각 송장별 출고 처리를 진행하여 결과 경로를 반환하는 기능
     *
     * @param invoice : 한 송장의 출고 상품 내역 정보
     * @return
     */
    private Map<String, List<ProductExportData>> calculatePath(
        List<ProductExportData> invoice, long businessId) {
        Map<String, List<ProductExportData>> path = new HashMap<>();
        for (ProductExportData productExportData : invoice) {
            //목적 상품에 해당하는 모든 로케이션 data
            List<ProductPickingLocationDto> candidates = productRepository.findPickingLocation(
                productExportData.getBarcode(), businessId);

            //남은양
            int remains = productExportData.getQuantity();

            for (ProductPickingLocationDto candidate : candidates) {
                if (candidate.getQuantity() == 0) {
                    continue;
                }

                if (candidate.getQuantity() >= remains) {
                    //candidate의 값을 remain 뺀 값으로 만들기.
                    updateProductQuantity(candidate.getProductId(),
                        candidate.getQuantity() - remains);
                    //path에 추가
                    List<ProductExportData> pickings = path.getOrDefault(
                        candidate.getWarehouseName(), new ArrayList<>());

                    pickings.add(ProductExportData.builder()
                        .trackingNumber(productExportData.getTrackingNumber())
                        .barcode(productExportData.getBarcode())
                        .locationName(candidate.getLocationName())
                        .floorLevel(candidate.getFloorLevel())
                        .productName(candidate.getProductName())
                        .quantity(candidate.getQuantity() - remains)
                        .date(LocalDate.now())
                        .build());
                    path.put(candidate.getWarehouseName(), pickings);
                    break;
                }

                remains -= candidate.getQuantity();

                //candidate의 값을 0으로 만들기.
                updateProductQuantity(candidate.getProductId(), 0);

                //path에 추가
                List<ProductExportData> pickings = path.getOrDefault(
                    candidate.getWarehouseName(), new ArrayList<>());

                pickings.add(ProductExportData.builder()
                    .locationName(candidate.getLocationName())
                    .floorLevel(candidate.getFloorLevel())
                    .productName(candidate.getProductName())
                    .quantity(0)
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
     * @param request
     */
    private void productQuantityCheck(ProductExportRequestDto request) {
        Long businessId = request.getBusinessId();
        List<ProductExportData> data = request.getData();

        //각 물품별 총합
        Map<Long, Integer> productTotalCount = data.stream().collect(
            Collectors.groupingBy((ProductExportData::getBarcode),
                Collectors.summingInt(ProductExportData::getQuantity)));

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
        log.info("productQuantityDto: {}", productQuantityDto);
        if (productQuantityDto.getPossibleQuantity() >= quantity) {
            return 0; //추가 명령 처리 x
        }

        if (productQuantityDto.getPossibleQuantity() +
            productQuantityDto.getMovableQuantity() >= quantity) {
            return 1; //보충 처리
        }

        return 2; //처리 불가.
    }

    /**
     * data를 ProductDetailRequestDto로 변환하는 메서드
     *
     * @param data
     * @return
     */
    private ProductDetailRequestDto buildProductDetailRequestDto(ProductImportRequestData data) {
        return ProductDetailRequestDto.builder()
            .barcode(data.getBarcode())
            .name(data.getName())
            .productStorageTypeEnum(data.getProductStorageTypeEnum())
            .build();
    }

    /**
     * data를 ProductRequestDto로 변환하는 메서드
     *
     * @param data
     * @return
     */
    private ProductRequestDto buildProductRequestDto(ProductImportRequestData data) {
        return ProductRequestDto.builder()
            .quantity(data.getQuantity())
            .expirationDate(data.getExpiry() != null ? data.getExpiry() : null)
            .build();
    }

    /**
     * dto를 합쳐서 ProductImportDto로 변환하는 메서드
     *
     * @param productImportRequestDto
     * @param productDetailRequestDto
     * @param productRequestDto
     * @return
     */
    private ProductImportDto buildProductImportDto(ProductImportRequestDto productImportRequestDto,
        ProductDetailRequestDto productDetailRequestDto,
        ProductRequestDto productRequestDto) {
        return ProductImportDto.builder()
            .businessId(productImportRequestDto.getBusinessId())
            .warehouseId(productImportRequestDto.getWarehouseId())
            .productDetail(productDetailRequestDto)
            .product(productRequestDto)
            .build();
    }
}
