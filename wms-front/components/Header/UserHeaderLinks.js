import React from "react";
import Link from "next/link";
import { makeStyles } from "@material-ui/core/styles";
import { List, ListItem, Icon } from "@mui/material";
import Button from "/components/CustomButtons/Button.js";
import styles from "/styles/jss/nextjs-material-kit/components/headerLinksStyle.js";

const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {
  const classes = useStyles();
  return (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <Button
          href="/login"
          color="transparent"
          className={`${classes.navLink} ${classes.rightLink} ${classes.whiteButton}`}
        >
          <Icon className={classes.icons}>unarchive</Icon>로그인
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          href="/signup"
          color="transparent"
          className={`${classes.navLink} ${classes.rightLink} ${classes.whiteButton}`}
        >
          <Icon className={classes.icons}>unarchive</Icon>회원가입
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          href="/components"
          color="transparent"
          className={`${classes.navLink} ${classes.rightLink} ${classes.whiteButton}`}
        >
          <Icon className={classes.icons}>unarchive</Icon>사용방법
        </Button>
      </ListItem>
    </List>
  );
}
