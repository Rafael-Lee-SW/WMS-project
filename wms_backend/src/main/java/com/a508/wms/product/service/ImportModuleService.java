package com.a508.wms.product.service;

import com.a508.wms.business.domain.Business;
import com.a508.wms.product.domain.Import;
import com.a508.wms.product.dto.ProductData;
import com.a508.wms.product.dto.ProductImportDto;
import com.a508.wms.product.dto.ProductImportResponseDto;
import com.a508.wms.product.mapper.ImportMapper;
import com.a508.wms.product.repository.ImportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ImportModuleService {
    private final ImportRepository importRepository;

    /**
     * 입고 dto와 business를 받아서 저장
     *
     * @param productImportDto : 입고 정보가 있는 dto
     * @param business         : 사업체의 정보가 담긴 객체
     */
    public void save(ProductImportDto productImportDto, Business business) {
        Import importEntity = ImportMapper.fromDto(productImportDto);
        importEntity.updateBusiness(business);
        importRepository.save(importEntity);
    }

    public ProductImportResponseDto findAllByBusinessIdAndDate(Long businessId, LocalDate date) {
//        1. repository에서 method 호출하기
        List<Import> importList = importRepository.findAllByBusinessIdAndDate(businessId, date);
//        2. {date, List<PIRD>}형태로 묶기
        List<ProductData> dataList = new ArrayList<>();
        for (Import imp : importList) {
            ProductData productData = ProductData.builder()
                    .name(imp.getName())
                    .quantity(imp.getQuantity())
                    .barcode(imp.getBarcode())
                    .expirationDate(imp.getExpirationDate())
                    .productStorageTypeEnum(imp.getProductStorageTypeEnum())
                    .build();
            dataList.add(productData);
        }
        return ProductImportResponseDto.builder()
                .date(date.atStartOfDay())
                .data(dataList)
                .build();
    }

    public ProductImportResponseDto findAllByBusinessId(Long businessId) {
//        1. repository에서 method 호출하기
        List<Import> importList = importRepository.findAllByBusinessId(businessId);
//        2. {date, List<PIRD>}형태로 묶기
        List<ProductData> dataList = new ArrayList<>();
        for (Import imp : importList) {
            ProductData productData = ProductData.builder()
                    .name(imp.getName())
                    .quantity(imp.getQuantity())
                    .barcode(imp.getBarcode())
                    .expirationDate(imp.getExpirationDate())
                    .productStorageTypeEnum(imp.getProductStorageTypeEnum())
                    .date(imp.getDate().toLocalDate())
                    .build();
            dataList.add(productData);
        }
        return ProductImportResponseDto.builder()
                .data(dataList)
                .build();
    }

}
