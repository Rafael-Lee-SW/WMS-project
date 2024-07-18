package com.a508.wms.domain;

import com.a508.wms.domain.util.BaseTimeEntity;
import com.a508.wms.util.StatusEnum;
import jakarta.persistence.*;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Table(name = "subscription_type")
public class SubscriptionType extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int cost;

    @Column(nullable = false,length = 20)
    private String name;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusEnum statusEnum = StatusEnum.ACTIVE;

    public SubscriptionType(Builder builder) {
        id = builder.id;
        cost = builder.cost;
        name = builder.name;
        statusEnum = builder.statusEnum;
    }

    public SubscriptionType() {
    }

    public static class Builder
    {
        private Long id;
        private int cost;
        private String name;
        private StatusEnum statusEnum;
        public Builder() {}
        public Builder id(Long id) {
            this.id = id;
            return this;
        }
        public Builder cost(int cost) {
            this.cost = cost;
            return this;
        }
        public Builder name(String name) {
            this.name = name;
            return this;
        }
        public Builder statusEnum(StatusEnum statusEnum) {
            this.statusEnum = statusEnum;
            return this;
        }
        public SubscriptionType build() {
            return new SubscriptionType(this);
        }

    }

}
