package com.a508.wms.service;

import com.a508.wms.domain.Subscription;
import com.a508.wms.dto.SubscriptionDto;
import com.a508.wms.repository.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubscriptionService {

    SubscriptionRepository subscriptionRepository;

    @Autowired
    public SubscriptionService(SubscriptionRepository subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }

    /**
     * 구독 테이블의 모든 정보를 반환하는 메서드
     * @return List<SubscriptionDto>
     */
    public List<SubscriptionDto> getSubscriptions() {

        List<Subscription> subscriptions = subscriptionRepository.findAll();
        return subscriptions.stream().map(SubscriptionDto::toSubscriptionDto).toList();
    }

}
