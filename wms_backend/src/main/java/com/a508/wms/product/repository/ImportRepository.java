package com.a508.wms.product.repository;

import com.a508.wms.product.domain.Import;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface ImportRepository extends JpaRepository<Import, Long> {
    @Query("Select i " +
            "from Import i " +
            "where function('DATE',i.date) =:date and i.business.id =:businessId")
    List<Import> findAllByBusinessIdAndDate(Long businessId, LocalDate date);

    @Query("Select i " +
            "from Import i " +
            "where i.business.id =:businessId")
    List<Import> findAllByBusinessId(Long businessId);
}
