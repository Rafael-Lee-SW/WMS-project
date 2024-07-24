package com.a508.wms.subscription.controller;

import com.a508.wms.util.BaseSuccessResponse;
import com.a508.wms.dto.SubscriptionDto;
import com.a508.wms.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    /**
     * 전체 구독 혹은 특정 사업체의 전체 구독을 조회하는 메서드
     *
     * @param businessId : 특정 사업체의 전체 구독을 조회하는 경우 사업체 고유 번호 입력
     * @return List<SubscriptionDto> (전체 구독),
     * List<SubscriptionDto> (특정 사업체의 전체 구독)
     */
    @GetMapping
    public BaseSuccessResponse<?> getSubscriptions(@RequestParam(required = false) long businessId) {
        if (businessId == 0) {
            return new BaseSuccessResponse<>(subscriptionService.getSubscriptions());
        } else {
            return new BaseSuccessResponse<>(subscriptionService.getSubscriptionByBusinessId(businessId));
        }
    }
    /**
     * 구독 정보를 등록하는 메서드
     *
     * @param businessId:     사업체 고유 번호
     * @param subscriptionDto : 등록할 정보
     * @return SubscriptionDto
     */
    @PostMapping
    public BaseSuccessResponse<?>  createSubscription(String businessId, @RequestBody SubscriptionDto subscriptionDto) {
        return new BaseSuccessResponse<>(subscriptionService.addSubscription(Long.parseLong(businessId), subscriptionDto));
    }

    /**
     * 구독 정보를 수정하는 메서드
     *
     * @param id              : 구독 고유 번호
     * @param subscriptionDto : 수정할 정보
     * @return SubscriptionDto
     */
    @PutMapping("/{id}")
    public BaseSuccessResponse<?>  updateSubscription(@PathVariable long id, @RequestBody SubscriptionDto subscriptionDto) {
        return new BaseSuccessResponse<>(subscriptionService.updateSubscription(id, subscriptionDto));
    }

    /**
     * 구독 정보를 삭제하는 메서드
     *
     * @param id : 구독 고유 번호
     */
    @PatchMapping("/{id}")
    public BaseSuccessResponse<Void> deleteSubscription(@PathVariable long id) {
        subscriptionService.deleteSubscription(id);
        return new BaseSuccessResponse<>(null);
    }
}
