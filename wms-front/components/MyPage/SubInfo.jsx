import React, { useState, useEffect } from "react";
import {
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import style from "/styles/jss/nextjs-material-kit/effect/modalStyle.js";
import { useRouter } from "next/router";

const useStyles = makeStyles(style);

export default function SubInfo() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [userData, setUserData] = useState(null);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // LocalStorage에서 유저 정보 불러오기
    const fetchUserData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.id) {
        console.error("User ID is missing from localStorage");
        return;
      }

      try {
        const userResponse = await fetch(
          `https://i11a508.p.ssafy.io/api/users/${user.id}`
        );
        if (!userResponse.ok) {
          console.error("Failed to fetch user data");
          return;
        }

        const userData = await userResponse.json();
        setUserData(userData.result);

        // BUSINESS인 경우에만 구독 정보 가져오기
        if (userData.result.roleTypeEnum === "BUSINESS") {
          const businessId = userData.result.businessId;
          const subscriptionResponse = await fetch(
            `http://localhost:8080/api/subscriptions?businessId=${businessId}`
          );

          if (!subscriptionResponse.ok) {
            console.error("Failed to fetch subscription data");
            return;
          }

          const subscriptionData = await subscriptionResponse.json();
          setSubscriptionData(subscriptionData.result);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleOpen = (subscription) => {
    setCurrentSubscription(subscription);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // 각 roleTypeEnum에 따라 다른 UI 렌더링
  const renderContentByRole = () => {
    if (!userData) {
      return <h4>Loading...</h4>;
    }

    switch (userData.roleTypeEnum) {
      case "GENERAL":
        return <h4>{userData.name}님, 사업자 등록 후 이용해주세요.</h4>;

      case "EMPLOYEE":
        return (
          <div>
            <h4>현재 직원입니다.</h4>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                // 사업장 나가기 로직 구현
                console.log("사업장 나가기");
              }}
            >
              사업장 나가기
            </Button>
          </div>
        );

      case "BUSINESS":
        if (subscriptionData.length === 0) {
          return <h4>구독 정보가 없습니다.</h4>;
        }

        const currentSubscription = subscriptionData[0];
        return (
          <div>
            <h4>
              현재 사용 중인 창고 수: {currentSubscription.warehouseCount}
            </h4>
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push("/payment")}
            >
              창고 추가 결제하기
            </Button>
            <div>
              {subscriptionData.map((subscription) => (
                <Card
                  key={subscription.id}
                  onClick={() => handleOpen(subscription)}
                  style={{
                    cursor: "pointer",
                    marginBottom: "10px",
                    padding: "10px",
                  }}
                >
                  <p>구독 타입 : {subscription.subscriptionTypeEnum}</p>
                  <p>구독 날짜 : {subscription.startDate}</p>
                </Card>
              ))}
            </div>
          </div>
        );

      default:
        return <h4>알 수 없는 사용자 역할입니다.</h4>;
    }
  };

  return (
    <div>
      <h2>구독 정보</h2>
      {renderContentByRole()}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>구독 상세 정보</DialogTitle>
        <DialogContent>
          {currentSubscription && (
            <>
              <p>구독 타입 : {currentSubscription.subscriptionTypeEnum}</p>
              <p>구독 날짜 : {currentSubscription.startDate}</p>
              <p>결제 방법 : {currentSubscription.paidTypeEnum}</p>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <button
            className={classes.modalCloseButton}
            onClick={handleClose}
            color="primary"
          >
            X
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
