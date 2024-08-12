import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";  // useRouter 훅 추가
import { Link as ScrollLink } from "react-scroll";
import { makeStyles } from "@material-ui/core/styles";
import { List, ListItem } from "@mui/material";
import Button from "/components/CustomButtons/Button.js";
import styles from "/styles/jss/nextjs-material-kit/components/headerLinksStyle.js";

const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {
  const classes = useStyles();
  const router = useRouter();  // useRouter 훅 초기화
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  // 현재 경로가 /mypage인지 확인
  const isMypage = router.pathname === '/mypage';

  return (
    <List className={classes.list}>
      {isLoggedIn && !isMypage ? (  // isMypage가 false일 때만 로그인 관련 링크 표시
        <>
          <ListItem className={classes.listItem}>
            <Button
              onClick={handleLogout}
              color="transparent"
              className={classes.navLink}
            >
              로그아웃
            </Button>
          </ListItem>
          <ListItem className={classes.listItem}>
            <Button
              href="/mypage"
              color="transparent"
              className={classes.navLink}
            >
              마이페이지
            </Button>
          </ListItem>
          <ListItem className={classes.listItem}>
            <Button
              href="/warehouse"
              color="transparent"
              className={classes.navLink}
            >
              창고관리
            </Button>
          </ListItem>
        </>
      ) : isLoggedIn && isMypage ? (  // 마이페이지일 때 로그아웃과 창고관리 링크만 표시
        <>
          <ListItem className={classes.listItem}>
            <Button
              onClick={handleLogout}
              color="transparent"
              className={classes.navLink}
            >
              로그아웃
            </Button>
          </ListItem>
          <ListItem className={classes.listItem}>
            <Button
              href="/warehouse"
              color="transparent"
              className={classes.navLink}
            >
              창고관리
            </Button>
          </ListItem>
        </>
      ) : (
        <>
          <ListItem className={classes.listItem}>
            <Button
              href="/signIn"
              color="transparent"
              className={classes.navLink}
            >
              로그인
            </Button>
          </ListItem>
          <ListItem className={classes.listItem}>
            <Button
              href="/signup"
              color="transparent"
              className={classes.navLink}
            >
              회원가입
            </Button>
          </ListItem>
        </>
      )}
    </List>
  );
}
