import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Link as ScrollLink } from "react-scroll"; 
import { makeStyles } from "@material-ui/core/styles";
import { List, ListItem, Tooltip, Icon } from "@mui/material";
import Button from "/components/CustomButtons/Button.js";
import styles from "/styles/jss/nextjs-material-kit/components/headerLinksStyle.js";

const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {
  const classes = useStyles();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); 
  }, []);

  return (
    <List className={classes.list}>
      {isLoggedIn ? (
        <>
          <ListItem className={classes.listItem}>
            <Button
              href="/logout"
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
      <ListItem className={classes.listItem}>
        <ScrollLink to="service-info" smooth={true} duration={500}>
          <Button color="transparent" className={classes.navLink}>
            서비스 소개
          </Button>
        </ScrollLink>
      </ListItem>
      <ListItem className={classes.listItem}>
        <ScrollLink to="how-to-use-start" smooth={true} duration={500}>
          <Button color="transparent" className={classes.navLink}>
            사용방법
          </Button>
        </ScrollLink>
      </ListItem>
    </List>
  );
}
