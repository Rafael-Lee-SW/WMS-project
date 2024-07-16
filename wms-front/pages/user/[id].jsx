import React, { useEffect } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// react components for routing our app without refresh
import Link from "next/link";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Header from "/components/Header/UserHeader.jsx";
import HeaderLinks from "/components/Header/HeaderLinks.js";
import Footer from "/components/Footer/Footer.js";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import Button from "/components/CustomButtons/Button.js";
import Parallax from "/components/Parallax/ParallaxUser.js";
// sections for this page
import SectionBasics from "/pages-sections/Components-Sections/MyContainer.jsx";
import SectionNavbars from "/pages-sections/Components-Sections/SectionNavbars.js";
import SectionTabs from "/pages-sections/Components-Sections/SectionTabs.js";
import SectionPills from "/pages-sections/Components-Sections/SectionPills.js";
import SectionNotifications from "/pages-sections/Components-Sections/SectionNotifications.js";
import SectionTypography from "/pages-sections/Components-Sections/SectionTypography.js";
import SectionJavascript from "/pages-sections/Components-Sections/SectionJavascript.js";
import SectionCarousel from "/pages-sections/Components-Sections/SectionCarousel.js";
import SectionCompletedExamples from "/pages-sections/Components-Sections/SectionCompletedExamples.js";
import SectionLogin from "/pages-sections/Components-Sections/SectionLogin.js";
import SectionExamples from "/pages-sections/Components-Sections/SectionExamples.js";
import SectionDownload from "/pages-sections/Components-Sections/SectionDownload.js";

import styles from "/styles/jss/nextjs-material-kit/pages/users.js";
import AOS from 'aos';
import 'aos/dist/aos.css';

const useStyles = makeStyles(styles);

export default function Components(props) {
  const classes = useStyles();
  const { ...rest } = props;

  useEffect(() => {
    AOS.init({
      duration: 800,
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
              <div className={classes.brand}>
                <h1 className={classes.title}>내 창고</h1>
              </div>
        </div>
      </Parallax>
      <div className={classNames(classes.main, classes.mainRaised)}>
        
        <div>
          <SectionBasics />
        </div>

      </div>
      <Footer />
    </div>
  );
}
