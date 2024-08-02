package com.a508.wms.product.service;

import com.a508.wms.business.domain.Business;
import com.a508.wms.product.domain.Export;
import com.a508.wms.product.dto.ExportResponseDto;
import com.a508.wms.product.mapper.ExportMapper;
import com.a508.wms.product.repository.ExportRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExportModuleService {
    private static final Logger log = LoggerFactory.getLogger(ExportModuleService.class);
    private final ExportRepository exportRepository;

    public void save(ExportResponseDto exportResponseDto, Business business) {
        log.info("exportResponseDto:{}", exportResponseDto);
        Export export = ExportMapper.fromDto(exportResponseDto);

        export.updateBusiness(business);

        exportRepository.save(export);
    }

    public List<ExportResponseDto> findAllByBusinessId(Long businessId) {
        List<ExportResponseDto> exportResponseDtos = new ArrayList<>();
        List<Export> exports = exportRepository.findAllByBusinessId(businessId);
        for (Export export : exports) {
            exportResponseDtos.add(ExportMapper.toDto(export));
        }
        return exportResponseDtos;
    }
}
