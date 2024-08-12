package com.a508.wms.user.controller;

import com.a508.wms.user.dto.UserRequestDto;
import com.a508.wms.user.dto.UserResponseDto;
import com.a508.wms.user.service.UserModuleService;
import com.a508.wms.user.service.UserService;
import com.a508.wms.util.BaseSuccessResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/users")
@Tag(name = "유저 관리", description = "유저 CRUD 관리")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserModuleService userModuleService;

    /**
     * 특정 사업체의 전체 직원, 특정 유저 1명, 혹은 이메일로 특정 유저를 조회하는 메서드
     *
     * @param businessId : 특정 사업체의 전체 직원을 조회하는 경우 사업체 고유 번호
     * @param userId : 특정 유저 1명을 조회하는 경우 유저의 고유 번호
     * @param email : 이메일로 특정 유저를 조회하는 경우
     * @return 조회 결과에 따른 BaseSuccessResponse 객체
     */
    @GetMapping()
    public BaseSuccessResponse<?> find(
            @RequestParam(value = "businessId", required = false) Long businessId,
            @RequestParam(value = "userId", required = false) Long userId,
            @RequestParam(value = "email", required = false) String email) {

        if (businessId != null) {
            log.info("[Controller] find Users by businessId: {}", businessId);
            return new BaseSuccessResponse<>(userService.findAllByBusinessId(businessId));
        } else if (userId != null) {
            log.info("[Controller] find User by id: {}", userId);
            return new BaseSuccessResponse<>(userService.findById(userId));
        } else if (email != null) {
            log.info("[Controller] find User by email: {}", email);
            return new BaseSuccessResponse<>(userModuleService.findByEmail(email));
        } else {
            log.warn("[Controller] No valid parameter provided for user lookup");
            return new BaseSuccessResponse<>(null);
        }
    }


    /**
     * userId, businessId로 해당 user의 businessId를 수정
     * @param businessId
     * @param id
     * @return
     */
    @PutMapping
    public BaseSuccessResponse<Void> updateByBusinessId(@RequestParam("businessId") Long businessId,
                                                        @RequestParam("id") Long id) {
        log.info("[Controller] update User by businessId: {}", businessId);
        userService.updateByBusinessId(businessId, id);
        return new BaseSuccessResponse<>(null);
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
