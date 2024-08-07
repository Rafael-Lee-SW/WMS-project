package com.a508.wms.product.service;

import com.a508.wms.business.domain.Business;
import com.a508.wms.business.service.BusinessModuleService;
import com.a508.wms.floor.domain.Floor;
import com.a508.wms.floor.service.FloorModuleService;
import com.a508.wms.location.service.LocationModuleService;
import com.a508.wms.product.domain.Product;
import com.a508.wms.product.dto.ExpirationProductResponseDto;
import com.a508.wms.product.dto.ExportResponseDto;
import com.a508.wms.product.dto.ProductData;
import com.a508.wms.product.dto.ProductExportRequestDto;
import com.a508.wms.product.dto.ProductExportResponseDto;
import com.a508.wms.product.dto.ProductImportRequestDto;
import com.a508.wms.product.dto.ProductMainResponseDto;
import com.a508.wms.product.dto.ProductPickingLocationDto;
import com.a508.wms.product.dto.ProductQuantityDto;
import com.a508.wms.product.dto.ProductResponseDto;
import com.a508.wms.product.dto.ProductUpdateRequestDto;
import com.a508.wms.product.exception.ProductInvalidRequestException;
import com.a508.wms.product.mapper.ProductMapper;
import com.a508.wms.product.repository.ProductRepository;
import com.a508.wms.productdetail.domain.ProductDetail;
import com.a508.wms.productdetail.mapper.ProductDetailMapper;
import com.a508.wms.productdetail.service.ProductDetailModuleService;
import com.a508.wms.util.constant.StatusEnum;
import com.a508.wms.warehouse.domain.Warehouse;
import com.a508.wms.warehouse.service.WarehouseModuleService;
import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.PriorityQueue;
import java.util.stream.Collectors;
import java.util.stream.Stream;
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
    private final ImportModuleService importModuleService;
    private final ProductRepository productRepository;
    private final ExportModuleService exportModuleService;
    private final int LIMIT_DAY = 1;
    private final WarehouseModuleService warehouseModuleService;
    private final LocationModuleService locationModuleService;

    /**
     * 서비스의 모든 상품을 반환하는 기능
     *
     * @return
     */
    public List<ProductMainResponseDto> findAll() {
        log.info("[Service] find Products");
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
        log.info("[Service] find Products by id: {}", id);
        try {
            Product product = productModuleService.findById(id);
            return ProductMapper.fromProduct(product);
        } catch (IllegalArgumentException e) {
            throw new ProductInvalidRequestException("id", id);
        }
    }

    /**
     * 특정 상품정보에 해당하는 상품들을 반환하는 기능
     *
     * @param productDetailId 상품정보(ProductDetail) id
     * @return
     */
    public List<ProductMainResponseDto> findByProductDetailId(Long productDetailId) {
        log.info("[Service] find Products by productDetailId: {}", productDetailId);

        try {
            productDetailModuleService.findById(productDetailId);
        } catch (IllegalArgumentException e) {
            throw new ProductInvalidRequestException("productDetailId", productDetailId);
        }
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
        log.info("[Service] find Products by businessId: {}", businessId);

        try {
            businessModuleService.findById(businessId);
        } catch (IllegalArgumentException e) {
            throw new ProductInvalidRequestException("businessId", businessId);
        }

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
        log.info("[Service] find Products by warehouseId: {}", warehouseId);

        if (warehouseModuleService.notExist(warehouseId)) {
            throw new ProductInvalidRequestException("warehouseId", warehouseId);
        }

        final List<Product> products = productModuleService.findByWarehouseId(warehouseId);

        return products.stream()
            .map(ProductMapper::toProductResponseDetailedResponseDto)
            .toList();
    }

    /**
     * 특정 로케이션에 들어있는 Product들을 반환하는 기능
     *
     * @param locationId location의 id
     * @return
     */
    @Transactional
    public List<ProductMainResponseDto> findByLocationId(Long locationId) {
        log.info("[Service] find Products by locationId: {}", locationId);

        if (locationModuleService.notExist(locationId)) {
            throw new ProductInvalidRequestException("locationId", locationId);
        }

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

    public void updateAll(List<ProductUpdateRequestDto> requestDtos) {
        log.info("[Service] update Products :");
        for (ProductUpdateRequestDto productUpdateRequestDto : requestDtos) {
            update(productUpdateRequestDto);
        }
    }

    /**
     * 기존 상품 데이터를 조회하여 수정하는 기능
     *
     * @param request 수정할 상품 데이터
     */
    public void update(ProductUpdateRequestDto request) {
        log.info("[Service] update Product by id: {}", request.getProductId());
        try {
            productModuleService.update(request);
        } catch (IllegalArgumentException e) {
            throw new ProductInvalidRequestException("request", request);
        }

    }

    /**
     * 상품의 상태값을 삭제로 변경, 해당 상품에 해당하는 모든 상품 로케이션 또한 변경.
     *
     * @param id 상품의 id
     */
    @Transactional
    public void delete(Long id) {
        log.info("[Service] delete Product by id: {}", id);
        try {
            Product product = productModuleService.findById(id);
            product.updateStatus(StatusEnum.DELETED);
            productModuleService.save(product);
        } catch (IllegalArgumentException e) {
            throw new ProductInvalidRequestException("id", id);
        }
    }

    /**
     * 상품들의 입고처리를 수행
     *
     * @param productImportRequestDto : dto
     */
    @Transactional
    public void importProducts(ProductImportRequestDto productImportRequestDto) {
        log.info("[Service] import Products by ProductImportRequestDto: {}",
            productImportRequestDto);
        Long warehouseId = productImportRequestDto.getWarehouseId();

        importValidate(productImportRequestDto.getBusinessId(), warehouseId);

        Floor defaultFloor = floorModuleService.findDefaultFloorByWarehouse(warehouseId);

        productImportRequestDto.getData()
            .forEach(data -> {
                importProduct(data, productImportRequestDto.getBusinessId(),
                    defaultFloor);
            });
    }

    private void importValidate(Long businessId, Long warehouseId) {
        try {
            Warehouse warehouse = warehouseModuleService.findById(warehouseId);

            if (!Objects.equals(warehouse.getBusiness().getId(), businessId)) {
                throw new ProductInvalidRequestException("businessId", businessId);
            }
        } catch (IllegalArgumentException e) {
            throw new ProductInvalidRequestException("warehouseId", warehouseId);
        }

    }

    /**
     * 한 상품의 입고처리를 수행함 입고로 들어온 상품이 DB에 있는지 확인한다. 상품의 동등성 판단은 상품 정보 id와 유톻기한으로 한다. 있다면 해당 상품의 총 수량을
     * 입고량만큼 추가해준다. 없다면 새로 상품을 추가한다. 추가: 입고 정보를 입고 테이블에 추가한다.
     *
     * @param request
     * @param defaultFloor 입고 처리 된 상품이 들어가는 default 층
     */
    private void importProduct(ProductData request, Long businessId,
        Floor defaultFloor) {
        log.info("[Service] import Product by productData: {}", request);

        ProductDetail productDetail = findOrCreateProductDetail(request, businessId);
        Product product = ProductMapper.fromProductData(request, productDetail, defaultFloor);

        productModuleService.save(product);
        importModuleService.save(request, product);
    }

    /**
     * 저장하려는 상품정보가 현재 DB에 있는지 확인하고 없으면 추가하는 기능
     *
     * @param request
     * @return
     */
    private ProductDetail findOrCreateProductDetail(ProductData request,
        Long businessId) {
        log.info("[Service] find or create Product by productData: {}", request);
        Optional<ProductDetail> optionalProductDetail = productDetailModuleService.findByBusinessIdAndBarcode(
            businessId, request.getBarcode());

        if (optionalProductDetail.isPresent()) {
            return optionalProductDetail.get();
        }

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
        log.info("[Service] export Products by ProductExportRequestDto: {}", request);

        try {
            businessModuleService.findById(request.getBusinessId());
        } catch (IllegalArgumentException e) {
            throw new ProductInvalidRequestException("businessId", request.getBusinessId());
        }

        productQuantityCheck(request);

        List<ExportResponseDto> datas = request.getData();

        Map<String, List<ExportResponseDto>> exports = datas.stream()
            .collect(Collectors.groupingBy(ExportResponseDto::getTrackingNumber));

        List<ProductExportResponseDto> result = exports.entrySet().stream()
            .map(entry -> {
                Map<String, List<ExportResponseDto>> path = calculatePath(entry.getValue(),
                    request.getBusinessId());
                return ProductExportResponseDto.builder()
                    .path(path)
                    .build();
            }).toList();
        Business business = businessModuleService.findById(request.getBusinessId());

        for (ProductExportResponseDto responseDto : result) {
            Map<String, List<ExportResponseDto>> path = responseDto.getPath();
            for (Map.Entry<String, List<ExportResponseDto>> entry : path.entrySet()) {
                List<ExportResponseDto> dataLists = entry.getValue();

                for (ExportResponseDto exportResponseDto : dataLists) {
                    exportModuleService.save(exportResponseDto, business);
                }
            }
        }
        return result;
    }

    /**
     * 각 송장별 출고 처리를 진행하여 결과 경로를 반환하는 기능
     *
     * @param invoice : 한 송장의 출고 상품 내역 정보
     * @return
     */
    private Map<String, List<ExportResponseDto>> calculatePath(
        List<ExportResponseDto> invoice, long businessId) {
        log.info("[Service] calculate export path of exportData: {}", invoice);

        Map<String, List<ExportResponseDto>> path = new HashMap<>();
        for (ExportResponseDto exportResponseDto : invoice) {
            List<ProductPickingLocationDto> candidates = productRepository.findPickingLocation(
                exportResponseDto.getBarcode(), businessId);
            PriorityQueue<ProductPickingLocationDto> priorityQueue = new PriorityQueue<>(
                Comparator
                    .comparing(ProductPickingLocationDto::getExpirationDate,
                        Comparator.nullsLast(Comparator.naturalOrder()))
                    .thenComparing(ProductPickingLocationDto::getQuantity,
                        Comparator.reverseOrder())
            );

            priorityQueue.addAll(candidates);

            int remains = exportResponseDto.getQuantity();
            for (ProductPickingLocationDto dto : priorityQueue) {
                if (dto.getQuantity() == 0) {
                    continue;
                }
                if (dto.getQuantity() >= remains) {
                    updateProductQuantity(dto.getProductId(),
                        dto.getQuantity() - remains);

                    List<ExportResponseDto> pickings = path.getOrDefault(
                        dto.getWarehouseName(), new ArrayList<>());

                    pickings.add(ExportResponseDto.builder()
                        .expirationDate(dto.getExpirationDate())
                        .trackingNumber(exportResponseDto.getTrackingNumber())
                        .barcode(exportResponseDto.getBarcode())
                        .locationName(dto.getLocationName())
                        .floorLevel(dto.getFloorLevel())
                        .productName(dto.getProductName())
                        .quantity(remains)
                        .date(LocalDate.now())
                        .productStorageType(dto.getProductStorageType())
                        .warehouseName(dto.getWarehouseName())
                        .warehouseId(dto.getWarehouseId())
                        .build());
                    path.put(dto.getWarehouseName(), pickings);
                    break;
                }

                remains -= dto.getQuantity();

                updateProductQuantity(dto.getProductId(), 0);

                List<ExportResponseDto> pickings = path.getOrDefault(
                    dto.getWarehouseName(), new ArrayList<>());

                pickings.add(ExportResponseDto.builder()
                    .expirationDate(dto.getExpirationDate())
                    .trackingNumber(exportResponseDto.getTrackingNumber())
                    .barcode(exportResponseDto.getBarcode())
                    .locationName(dto.getLocationName())
                    .floorLevel(dto.getFloorLevel())
                    .productName(dto.getProductName())
                    .quantity(dto.getQuantity())
                    .date(LocalDate.now())
                    .productStorageType(dto.getProductStorageType())
                    .warehouseName(dto.getWarehouseName())
                    .warehouseId(dto.getWarehouseId())
                    .build());
                path.put(dto.getWarehouseName(), pickings);
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
        log.info("[Service] update Product quantity by productId: {}", productId);
        Product product = productModuleService.findById(productId);

        product.updateData(quantity);

        productModuleService.save(product);
    }

    /**
     * 현제 출고 명령이 재고상 가능한 상태인지 판단해주는 기능,예외처리 안되면 출고 가능
     *
     * @param request
     */
    private void productQuantityCheck(ProductExportRequestDto request) {
        log.info("[Service] check productQuantity by ProductExportRequestDto: {}", request);

        Long businessId = request.getBusinessId();
        List<ExportResponseDto> datas = request.getData();

        Map<Long, Integer> productTotalCount = datas.stream().collect(
            Collectors.groupingBy((ExportResponseDto::getBarcode),
                Collectors.summingInt(ExportResponseDto::getQuantity)));

        Map<Long, Integer> productQuantityResult = productTotalCount.entrySet().stream()
            .collect(Collectors.toMap(Map.Entry::getKey,
                entry -> calculateProductQuantity(entry.getKey(), entry.getValue(), businessId)));

        if (containsImpossibleExportProduct(productQuantityResult)) {
            //throw new ProductExportException("수량 부족");
        }

        List<Long> movingProductBarcodes = new ArrayList<>();

        productQuantityResult.entrySet().stream()
            .filter(entry -> entry.getValue() == 1)
            .forEach(entry -> movingProductBarcodes.add(entry.getKey()));

        if (!movingProductBarcodes.isEmpty()) {
//            throw new ProductExportException(
//                "해당 물품들의 이동이 필요합니다." + movingProductBarcodes);
            throw new IllegalArgumentException("해당 물품들의 이동이 필요합니다." + movingProductBarcodes);
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
        log.info("[Service] calculate Product quantity of import product by barcode: {}", barcode);
        ProductQuantityDto productQuantityDto = productModuleService.findProductQuantityByBarcodeAndBusinessId(
            barcode, businessId);
        if (productQuantityDto.getPossibleQuantity() >= quantity) {
            return 0;
        }

        if (productQuantityDto.getPossibleQuantity() +
            productQuantityDto.getMovableQuantity() >= quantity) {
            return 1;
        }

        return 2;
    }


    /**
     * 특정 사업자의 Product 중 유통기한이 머지 않았거나,이미 지난 상품을 반환하는 기능 .
     *
     * @param businessId 사업자의 id
     * @return
     */
    @Transactional
    public List<ExpirationProductResponseDto> findExpirationProducts(Long businessId) {
        log.info("[Service] find Expired Warning Product by businessId: {}", businessId);
        LocalDateTime currentTime = LocalDateTime.now();

        List<Product> products = productModuleService.findByBusinessId(businessId)
            .stream()
            .filter(product -> product.getExpirationDate() != null)
            .toList();

        List<Product> expirationSoonProducts = products.stream()
            .filter(product -> isExpiredSoonProduct(product, currentTime))
            .toList();

        List<Product> expirationExpiredProducts = products.stream()
            .filter(product -> isAlreadyExpiredProduct(product, currentTime))
            .toList();

        return mergeAndConvertExpirationProducts(expirationSoonProducts, expirationExpiredProducts);
    }

    /**
     * Product의 유통기한이 얼마 안남았는지 여부를 반환하는 기능.
     *
     * @param product     상품
     * @param currentTime 현재 시간
     * @return
     */
    private boolean isExpiredSoonProduct(Product product, LocalDateTime currentTime) {
        return product.getExpirationDate().isAfter(currentTime) && product.getExpirationDate()
            .isBefore(currentTime.plusDays(LIMIT_DAY));
    }

    /**
     * Product의 유통기한이 이미 지났는지 여부를 반환하는 기능.
     *
     * @param product
     * @param currentTime
     * @return
     */
    private boolean isAlreadyExpiredProduct(Product product, LocalDateTime currentTime) {
        return product.getExpirationDate().isBefore(currentTime);
    }

    /**
     * 유통기한에 관련된 두 리스트를 하나의 반환 리스트로 병합하여 반환하는 기능.
     *
     * @param expirationSoonProducts
     * @param expirationExpiredProducts
     * @return
     */
    private List<ExpirationProductResponseDto> mergeAndConvertExpirationProducts(
        List<Product> expirationSoonProducts, List<Product> expirationExpiredProducts) {
        return Stream.concat(
            expirationSoonProducts.stream()
                .map(product -> ProductMapper.toExpirationProductResponseDto(product, false))
            ,
            expirationExpiredProducts.stream()
                .map(product -> ProductMapper.toExpirationProductResponseDto(product, true))
        ).toList();
    }
}
