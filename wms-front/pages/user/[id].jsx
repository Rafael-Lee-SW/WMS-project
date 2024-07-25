import React, { useEffect, useState } from "react";
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
// // sections for this page
// import MyContainer from "/pages-sections/Components-Sections/MyContainer.jsx";
// // 버튼을 통해 하위 Components 를 바꾸기 위한 Test Components import
// import MyContainerTest from "/pages-sections/Components-Sections/MyContainerTest";
// import MyContainerThree from "/pages-sections/Components-Sections/MyContainerThree";
// 다이나믹 import를 위한 거시기
import dynamic from "next/dynamic";

// @material-ui/icons
import InventoryIcon from "@mui/icons-material/Inventory";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import ListAltIcon from "@mui/icons-material/ListAlt";

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
import AOS from "aos";
import "aos/dist/aos.css";
import { Preview } from "@mui/icons-material";

// 다이나믹 import 테스트
const DynamicMyContainer = dynamic(
  () => import("/pages-sections/Components-Sections/MyContainer.jsx"),
  {ssr : false}
)
const DynamicMyContainerDual = dynamic(
  () => import("/pages-sections/Components-Sections/MyContainerDual.jsx"),
  {ssr : false}
)
const DynamicMyContainerProduct = dynamic(
  () => import("/pages-sections/Components-Sections/MyContainerProduct.jsx"),
  {ssr : false}
)

const useStyles = makeStyles(styles);

export default function Components(props) {

  const classes = useStyles();
  const { ...rest } = props;

  useEffect(() => {
    AOS.init({
      duration: 100,
    });
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);

  const componentsArray = [
    <DynamicMyContainer key="DynamicMyContainer"/>,
    <DynamicMyContainerDual key="DynamicMyContainerDual" />,
    <DynamicMyContainerProduct key="DynamicMyContainerProduct"/>,
  ];

  const handleNextComponent = (index) => {
    setCurrentIndex(index);
  };

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
          color: "white",
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
        <div className={classes.sections}>
          <div className={classes.container}>
             <br/>
            <div className={classes.flexContainer}>
              <div className={classes.currentWarehouse}>
                현재 창고 : 1번
              </div>
              <div className={classes.buttonsContainer}>
                <Button color="primary" round onClick={() => handleNextComponent(0)}>
                <InventoryIcon className={classes.icons} />창고 관리
                </Button>
                <Button color="info" round onClick={() => handleNextComponent(1)}>
                <ProductionQuantityLimitsIcon className={classes.icons} />재고 관리
                </Button>
                <Button color="success" round onClick={() => handleNextComponent(2)}>
                <ListAltIcon className={classes.icons} />재고 현황
                </Button>
              </div>
            </div>
            <hr />
            {/* 메인 영역 */}
            {componentsArray[currentIndex]}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
