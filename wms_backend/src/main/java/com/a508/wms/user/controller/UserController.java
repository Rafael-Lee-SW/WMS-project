package com.a508.wms.user.controller;

import com.a508.wms.user.dto.UserDto;
import com.a508.wms.user.service.UserService;
import com.a508.wms.util.BaseSuccessResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@Tag(name = "유저 관리", description = "유저 CRUD 관리")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * 전체 직원 혹은 특정 사업체의 전체 직원을 조회하는 메서드
     *
     * @param businessId : 특정 사업체의 전체 직원을 조회하는 경우 사업체 고유 번호 입력
     * @return List<UserDto> (전체 직원), List<UserDto> (특정 사업체의 전체 직원)
     */
    @GetMapping
    public BaseSuccessResponse<List<UserDto>> getEmployees(
        @RequestParam(value = "businessId", required = false) Long businessId) {
        if (businessId != null) {
            return new BaseSuccessResponse<>(userService.findByBusinessId(businessId));
        } else {
            return new BaseSuccessResponse<>(userService.findAllEmployee());
        }
    }

    /**
     * 특정 유저 1명을 조회하는 메서드
     *
     * @param id : 유저의 고유 번호
     * @return UserDto
     */
    @GetMapping("/{id}")
    public BaseSuccessResponse<UserDto> getUser(@PathVariable("id") long id) {
        return new BaseSuccessResponse<>(userService.findById(id));
    }

    /**
     * 직원 1명의 정보를 수정하는 메서드
     *
     * @param id          : 직원의 고유 번호
     * @param userDto : 변경할 직원의 정보
     * @return UserDto : 변경된 직원의 정보
     */
    @PutMapping("/{id}")
    public BaseSuccessResponse<UserDto> updateUser(@PathVariable("id") long id,
        @RequestBody UserDto userDto) {
        return new BaseSuccessResponse<>(userService.update(id, userDto));
    }

    /**
     * 직원 1명을 삭제하는 메서드. 실제로 데이터를 지우지 않고 상태를 DELETED로 변경해 삭제된 것처럼 처리.
     *
     * @param id : 직원의 고유 번호
     * @return UserDto : 변경된 직원의 정보
     */
    @PatchMapping("/{id}")
    public BaseSuccessResponse<UserDto> deleteUser(@PathVariable("id") long id) {
        return new BaseSuccessResponse<>(userService.delete(id));
    }
}
