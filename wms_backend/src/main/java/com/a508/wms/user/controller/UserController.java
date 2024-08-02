package com.a508.wms.user.controller;

import com.a508.wms.user.dto.UserRequestDto;
import com.a508.wms.user.dto.UserResponseDto;
import com.a508.wms.user.service.UserService;
import com.a508.wms.util.BaseSuccessResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/users")
@Tag(name = "유저 관리", description = "유저 CRUD 관리")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * 특정 사업체의 전체 직원을 조회하는 메서드
     *
     * @param businessId : 특정 사업체의 전체 직원을 조회하는 경우 사업체 고유 번호 입력
     * @return List<UserDto> (전체 직원), List<UserDto> (특정 사업체의 전체 직원)
     */
    @GetMapping
    public BaseSuccessResponse<List<UserResponseDto>> findByBusinessId(
        @RequestParam(value = "businessId") Long businessId) {
        log.info("[Controller] find User by businessId: {}", businessId);
        return new BaseSuccessResponse<>(userService.findByBusinessId(businessId));
    }

    /**
     * 특정 유저 1명을 조회하는 메서드
     *
     * @param id : 유저의 고유 번호
     * @return UserDto
     */
    @GetMapping("/{id}")
    public BaseSuccessResponse<UserResponseDto> findById(@PathVariable("id") Long id) {
        log.info("[Controller] find User by id: {}", id);
        return new BaseSuccessResponse<>(userService.findById(id));
    }

    /**
     * 직원 1명의 정보를 수정하는 메서드
     *
     * @param id      : 직원의 고유 번호
     * @param request : 변경할 직원의 정보
     * @return UserDto : 변경된 직원의 정보
     */
    @PutMapping("/{id}")
    public BaseSuccessResponse<UserResponseDto> update(@PathVariable("id") Long id,
        @RequestBody UserRequestDto request) {
        log.info("[Controller] update user by id: {}", id);
        return new BaseSuccessResponse<>(userService.update(id, request));
    }

    /**
     * 직원 1명을 삭제하는 메서드. 실제로 데이터를 지우지 않고 상태를 DELETED로 변경해 삭제된 것처럼 처리.
     *
     * @param id : 직원의 고유 번호
     * @return UserDto : 변경된 직원의 정보
     */
    @PatchMapping("/{id}")
    public BaseSuccessResponse<UserResponseDto> delete(@PathVariable("id") Long id) {
        log.info("[Controller] delete user by id: {}", id);
        return new BaseSuccessResponse<>(userService.delete(id));
    }
}
