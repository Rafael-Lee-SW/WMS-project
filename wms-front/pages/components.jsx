import React, { useEffect } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// react components for routing our app without refresh
import Link from "next/link";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Header from "/components/Header/Header.js";
import HeaderLinks from "/components/Header/HeaderLinks.js";
import Footer from "/components/Footer/Footer.js";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import Button from "/components/CustomButtons/Button.js";
import Parallax from "/components/Parallax/Parallax.js";
// sections for this page
import SectionBasics from "/pages-sections/Components-Sections/SectionBasics.js";
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
        <div data-aos="fade-up">
          <SectionBasics />
        </div>
        <div data-aos="fade-up">
          <SectionNavbars />
        </div>
        <div data-aos="fade-up">
          <SectionTabs />
        </div>
        <div data-aos="fade-up">
          <SectionPills />
        </div>
        <div data-aos="fade-up">
          <SectionNotifications />
        </div>
        <div data-aos="fade-up">
          <SectionTypography />
        </div>
        <div data-aos="fade-up">
          <SectionJavascript />
        </div>
        <div data-aos="fade-up">
          <SectionCarousel />
        </div>
        <div data-aos="fade-up">
          <SectionCompletedExamples />
        </div>
        <div data-aos="fade-up">
          <SectionLogin />
        </div>
        <GridItem md={12} className={classes.textCenter} data-aos="fade-up">
          <Link href="/login">
            <a className={classes.link}>
              <Button color="primary" size="lg" simple>
                View Login Page
              </Button>
            </a>
          </Link>
        </GridItem>
        <div data-aos="fade-up">
          <SectionExamples />
        </div>
        <div data-aos="fade-up">
          <SectionDownload />
        </div>
      </div>
      <Footer />
    </div>
  );
}
