import React from "react";
import { useRouter } from "next/router"; // Import useRouter
import { makeStyles } from "@material-ui/core/styles";
import { List, ListItem } from "@mui/material"; // Correct casing for ListItem
import Button from "/components/CustomButtons/Button.js";
import { Link as ScrollLink } from "react-scroll"; // react-scroll import 추가

import styles from "/styles/jss/nextjs-material-kit/components/headerLinksStyle.js";

const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {
  const classes = useStyles();
  const router = useRouter(); // Initialize useRouter

  const handleLogout = () => {
    // Remove the token from local storage
    localStorage.removeItem("token");
    // Redirect to the homepage
    router.push("/");
  };

  const handleWarehouseManagement = () => {
    // 로컬 스토리지에서 user 정보를 가져옵니다.
    const user = localStorage.getItem("user");
    if (user) {
      const userInfo = JSON.parse(user);

      // 사용자 역할에 따라 Mypage로 이동할 때 초기 컴포넌트를 설정합니다.
      if (userInfo.roleTypeEnum === "GENERAL") {
        // roleTypeEnum이 "GENERAL"인 경우 쿼리 파라미터로 전달
        router.push({
          pathname: "/mypage",
          query: { component: "license" },
        });
      } else {
        // 다른 역할일 경우 기본 창고 관리 페이지로 이동
        router.push("/user/select");
      }
    } else {
      // 사용자가 로그인되어 있지 않으면 로그인 페이지로 이동하도록 할 수도 있습니다.
      alert("로그인이 필요합니다.");
      router.push("/login");
    }
  };

  return (
    <List className={classes.list}>
      <ListItem className={classes.listItem}> {/* Correct casing */}
        <Button
          onClick={handleWarehouseManagement} // 클릭 시 handleWarehouseManagement 함수 호출
          color="transparent"
          className={classes.navLink}>
          창고 관리
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}> {/* Correct casing */}
        <Button
          href="/mypage"
          color="transparent"
          className={classes.navLink}>
          마이페이지
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}> {/* Correct casing */}
        <Button
          onClick={handleLogout} 
          color="transparent"
          className={classes.navLink}>
          로그아웃
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}> {/* Correct casing */}
        <ScrollLink to="service-info" smooth={true} duration={500}>
          <Button
            color="transparent"
            className={classes.navLink}>
            서비스 소개
          </Button>
        </ScrollLink>
      </ListItem>
      <ListItem className={classes.listItem}> {/* Correct casing */}
        <ScrollLink to="how-to-use-start" smooth={true} duration={500}>
          <Button
            color="transparent"
            className={classes.navLink}>
            사용방법
          </Button>
        </ScrollLink>
      </ListItem>
    </List>
  );
}
