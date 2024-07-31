package com.a508.wms.user.service;

import com.a508.wms.user.domain.User;
import com.a508.wms.user.dto.UserDto;
import com.a508.wms.user.mapper.UserMapper;
import com.a508.wms.user.repository.UserRepository;
import com.a508.wms.util.constant.RoleTypeEnum;
import com.a508.wms.util.constant.StatusEnum;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserModuleService userModuleService;
    private final UserRepository userRepository;

    /**
     * 전체 직원을 조회하는 메서드
     *
     * @return List<EmployeeDto> (전체 직원)
     */
    public List<UserDto> findAllEmployee() {
        List<User> users = userRepository.findAllEmployees(RoleTypeEnum.EMPLOYEE);
        return users.stream()
            .map(UserMapper::fromUser)
            .collect(Collectors.toList());
    }

    /**
     * 특정 직원 1명을 조회하는 메서드
     *
     * @param id : 직원의 고유 번호
     * @return employeeDto
     */
    public UserDto findById(long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Invalid Employee ID: " + id));
        return UserMapper.fromUser(user);
    }

    /**
     * 특정 사업체에 등록된 전체 직원의 정보를 조회하는 메서드
     *
     * @param businessId
     * @return List<EmployeeDto> (특정 사업체의 전체 직원)
     */
    public List<UserDto> findByBusinessId(long businessId) {
        List<User> users = userRepository.findByBusinessId(businessId);
        return users.stream()
            .map(UserMapper::fromUser)
            .collect(Collectors.toList());
    }


    /**
     * 직원 1명의 정보를 수정하는 메서드
     *
     * @param id          : 직원의 고유 번호
     * @param userDto : 변경할 직원의 정보
     * @return UserDto : 변경된 직원의 정보
     */
    public UserDto update(long id, UserDto userDto) {
        // 있는지 확인
        User user = userModuleService.findById(id);

        userDto.setId(id);
        User updatedUser = userModuleService.save(UserMapper.fromDto(userDto));

        return UserMapper.fromUser(updatedUser);
    }

    /**
     * 직원 1명을 삭제하는 메서드. 실제로 데이터를 지우지 않고 상태를 DELETED로 변경해 삭제된 것처럼 처리.
     *
     * @param id : 직원의 고유 번호
     * @return UserDto : 변경된 직원의 정보
     */
    public UserDto delete(long id) {
        User user = userModuleService.findById(id);
        user.setStatusEnum(StatusEnum.DELETED);
        User deletedUser = userModuleService.save(user);
        return UserMapper.fromUser(deletedUser);
    }
}
