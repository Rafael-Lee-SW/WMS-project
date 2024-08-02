package com.a508.wms.product.repository;


import com.a508.wms.product.domain.Export;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ExportRepository extends JpaRepository<Export, Long> {

    @Query(value = "SELECT e FROM Export e WHERE e.business.id = :businessId")
    List<Export> findAllByBusinessId(Long businessId);
}
