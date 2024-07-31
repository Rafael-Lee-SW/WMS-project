package com.a508.wms.user.service;

import com.a508.wms.user.domain.User;
import com.a508.wms.user.repository.UserRepository;
import com.a508.wms.util.constant.StatusEnum;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserModuleService {

    private final UserRepository userRepository;

    /**
     * 전체 직원을 조회하는 메서드
     *
     * @return List<EmployeeDto> (전체 직원)
     */
    public List<User> findAllEmployee() {
        return userRepository.findAll();
    }

    /**
     * 특정 직원 1명을 조회하는 메서드
     *
     * @param id : 직원의 고유 번호
     * @return employeeDto
     */
    public User findById(long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Invalid Employee ID: " + id));
    }

    /**
     * 특정 사업체에 등록된 전체 직원의 정보를 조회하는 메서드
     *
     * @param businessId
     * @return List<EmployeeDto> (특정 사업체의 전체 직원)
     */
    public List<User> findByBusinessId(long businessId) {
        return userRepository.findEmployeesByBusinessId(businessId);
    }

    public User save(User user) {
        return userRepository.save(user);
    }


    /**
     * 직원 1명을 삭제하는 메서드. 실제로 데이터를 지우지 않고 상태를 DELETED로 변경해 삭제된것 처럼 처리.
     *
     * @param user : 삭제하려는 직원 정보
     * @return employeeDto : 변경된 직원의 정보
     */
    public User delete(User user) {
        user.setStatusEnum(StatusEnum.DELETED);
        return save(user);
    }
}
