import { Card } from "@material-ui/core";

export default function SubInfo({ subscriptions }) {
  return (
    <div>
      <h2>구독 정보</h2>
      <Card>
        {subscriptions.map((subscription) => (
          <div key={subscription.id}>
            <p>구독 타입 : {subscription.subscriptionTypeEnum}</p>
            <p>구독 날짜 : {subscription.startDate}</p>
            <p>결제 방법 : {subscription.paidTypeEnum}</p>
          </div>
        ))}
      </Card>
    </div>
  );
}
