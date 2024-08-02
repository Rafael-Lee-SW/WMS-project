import React, { useEffect } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// react components for routing our app without refresh
import Link from "next/link";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Header from "/components/Header/HomeHeader.js";
import HeaderLinks from "/components/Header/HomeHeaderLinks.js";
import Footer from "/components/Footer/Footer.js";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import Parallax from "/components/Parallax/Parallax.js";

import styles from "/styles/jss/nextjs-material-kit/pages/components.js";
import AOS from 'aos';
import 'aos/dist/aos.css';

const useStyles = makeStyles(styles);

export default function Components(props) {
  const classes = useStyles();
  const { ...rest } = props;

  useEffect(() => {
    AOS.init({
      duration: 1200,
    });
  }, []);

  return (
    /** 헤더 영역 */
    <div>
      <Header
        brand="ADN Project for Inventory Manangement"
        rightLinks={<HeaderLinks />}
        fixed
        color="transparent"
        changeColorOnScroll={{
          height: 400,
          color: "white"
        }}
        {...rest}
      />
      <Parallax image="/img/WareHouseWallpaper.png">
        <div className={classes.container}>
          <GridContainer>
            <GridItem>
              <div className={classes.brand} data-aos="fade-up">
                <h1 className={classes.title}>ADN for Inventory Manangement</h1>
                <h3 className={classes.subtitle}>
                  재고 정리의 모든 것은 ADN에서!
                </h3>
                <h3 className={classes.subtitle}>
                  여러분이 원하는 모든 기능을 제공합니다.
                </h3>
              </div>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      <div className={classNames(classes.main, classes.mainRaised)}>
      </div>
      <Footer />
    </div>
  );
}
