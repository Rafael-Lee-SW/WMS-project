package com.a508.wms.employee.repository;

import com.a508.wms.employee.domain.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    //    businessId에 맞는 모든 직원을 반환
    @Query("SELECT e FROM Employee e WHERE e.business.id = :businessId")
    List<Employee> findByBusinessId(@Param("businessId") long businessId);
}