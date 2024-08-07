package com.a508.wms.user.service;

import com.a508.wms.business.domain.Business;
import com.a508.wms.business.service.BusinessModuleService;
import com.a508.wms.user.domain.User;
import com.a508.wms.user.dto.UserRequestDto;
import com.a508.wms.user.dto.UserResponseDto;
import com.a508.wms.user.mapper.UserMapper;
import com.a508.wms.user.repository.UserRepository;
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
    private final BusinessModuleService businessModuleService;

    /**
     * 특정 직원 1명을 조회하는 메서드
     *
     * @param id : 직원의 고유 번호
     * @return employeeDto
     */
    public UserResponseDto findById(Long id) {
        log.info("[Service] find User by id: {}", id);
        User user = userRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Invalid Employee ID: " + id));
        return UserMapper.toUserResponseDto(user);
    }

    /**
     * 특정 사업체에 등록된 전체 직원의 정보를 조회하는 메서드
     *
     * @param businessId
     * @return List<EmployeeDto> (특정 사업체의 전체 직원)
     */
    public List<UserResponseDto> findByBusinessId(Long businessId) {
        log.info("[Service] find Employee User by BusinessId: {}", businessId);
        List<User> users = userRepository.findByBusinessId(businessId);
        return users.stream()
            .map(UserMapper::toUserResponseDto)
            .collect(Collectors.toList());
    }


    /**
     * 직원 1명의 정보를 수정하는 메서드
     *
     * @param id      : 직원의 고유 번호
     * @param request : 변경할 직원의 정보
     * @return UserDto : 변경된 직원의 정보
     */
    public UserResponseDto update(Long id, UserRequestDto request) {
        log.info("[Service] update User by id: {}", id);
        User user = userModuleService.findById(id);
        user.updateInfo(request);
        User updatedUser = userModuleService.save(user);

        return UserMapper.toUserResponseDto(updatedUser);
    }

    /**
     * 직원 1명을 삭제하는 메서드. 실제로 데이터를 지우지 않고 상태를 DELETED로 변경해 삭제된 것처럼 처리. 직원의 사업체도 같이 지움.
     *
     * @param id : 직원의 고유 번호
     * @return UserDto : 변경된 직원의 정보
     */
    public UserResponseDto delete(Long id) {
        log.info("[Service] delete User by id: {}", id);
        User user = userModuleService.findById(id);
        user.setStatusEnum(StatusEnum.DELETED);
        Business userBusiness = businessModuleService.findByUserId(user.getId());
        if (userBusiness != null) {
            businessModuleService.delete(userBusiness);
        }
        User deletedUser = userModuleService.save(user);
        return UserMapper.toUserResponseDto(deletedUser);
    }

    public  User findByEmail(String email) {
        return userRepository.findUserByEmail(email);
    }
}
