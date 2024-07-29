package com.a508.wms.auth.repository;

import com.a508.wms.auth.domain.Certification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface CertificationRepository extends JpaRepository<Certification, String> {

    Certification findByUserId(String userId);

    Certification findByEmail(String email);

    @Transactional
    Certification deleteByEmail(String email);
}
