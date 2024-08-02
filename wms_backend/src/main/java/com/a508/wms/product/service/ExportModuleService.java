package com.a508.wms.product.service;

import com.a508.wms.business.domain.Business;
import com.a508.wms.product.domain.Export;
import com.a508.wms.product.dto.ExportResponseDto;
import com.a508.wms.product.mapper.ExportMapper;
import com.a508.wms.product.repository.ExportRepository;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExportModuleService {

    private final ExportRepository exportRepository;

    public void save(ExportResponseDto exportResponseDto, Business business) {
        Export export = ExportMapper.fromExportResponseDto(exportResponseDto);
        export.updateBusiness(business);

        exportRepository.save(export);
    }

    public List<ExportResponseDto> findAllByBusinessId(Long businessId) {
        List<ExportResponseDto> exportResponseDtos = new ArrayList<>();
        List<Export> exports = exportRepository.findAllByBusinessId(businessId);
        for (Export export : exports) {
            exportResponseDtos.add(ExportMapper.toExportResponseDto(export));
        }
        return exportResponseDtos;
    }
}
