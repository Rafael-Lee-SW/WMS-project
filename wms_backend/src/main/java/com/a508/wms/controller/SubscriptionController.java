package com.a508.wms.controller;

import com.a508.wms.dto.SubscriptionDto;
import com.a508.wms.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/subscriptions")
public class SubscriptionController {

    SubscriptionService subscriptionService;

    @Autowired
    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }
    /**
     * 전체 구독 혹은 특정 사업체의 전체 구독을 조회하는 메서드
     * @param businessId : 특정 사업체의 전체 구독을 조회하는 경우 사업체 고유 번호 입력
     * @return List<SubscriptionDto> (전체 구독),
     *         List<SubscriptionDto> (특정 사업체의 전체 구독)
     */
    @GetMapping
    public List<SubscriptionDto> getSubscriptions(@RequestParam(required = false) String businessId) {
        if(businessId == null) {
        return subscriptionService.getSubscriptions();
        } else {
            return subscriptionService.getSubscriptionByBusinessId(Long.parseLong(businessId));
        }
    }

    /**
     * 구독 정보를 등록하는 메서드
     * @param businessId: 사업체 고유 번호
     * @param subscriptionDto : 등록할 정보
     * @return SubscriptionDto
     */
    @PostMapping
    public SubscriptionDto createSubscription(String businessId, @RequestBody SubscriptionDto subscriptionDto) {
        return subscriptionService.addSubscription(Long.parseLong(businessId), subscriptionDto);
    }

    /**
     * 구독 정보를 수정하는 메서드
     * @param id : 구독 고유 번호
     * @param subscriptionDto : 수정할 정보
     * @return SubscriptionDto
     */
    @PutMapping("/{id}")
    public SubscriptionDto updateSubscription(@PathVariable long id, @RequestBody SubscriptionDto subscriptionDto) {
        return subscriptionService.updateSubscription(id, subscriptionDto);
    }

    /**
     * 구독 정보를 삭제하는 메서드
     * @param id : 구독 고유 번호
     */
    @PatchMapping("/{id}")
    public void deleteSubscription(@PathVariable long id) {
        subscriptionService.deleteSubscription(id);
    }
}
