import React from "react";
import Link from "next/link";
import { Link as ScrollLink } from "react-scroll"; // react-scroll import 추가
import { useRouter } from "next/router"; // Import useRouter
import { makeStyles } from "@material-ui/core/styles";
import { List, ListItem, Tooltip, Icon } from "@mui/material";
import { Apps, CloudDownload } from "@material-ui/icons";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import CustomDropdown from "/components/CustomDropdown/CustomDropdown.js";
import Button from "/components/CustomButtons/Button.js";

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

  return (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <Button
          href="/user/select"
          color="transparent"
          className={classes.navLink}>
          창고 관리
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          href="/mypage"
          color="transparent"
          className={classes.navLink}>
          마이페이지
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          onClick={handleLogout} 
          color="transparent"
          className={classes.navLink}>
          로그아웃
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <ScrollLink to="service-info" smooth={true} duration={500}>
          <Button
            color="transparent"
            className={classes.navLink}>
            서비스 소개
          </Button>
        </ScrollLink>
      </ListItem>
      <ListItem className={classes.listItem}>
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
