import React, { useEffect, useState } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// react components for routing our app without refresh
import Link from "next/link";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Header from "/components/Header/UserHeader.jsx";
import HeaderLinks from "/components/Header/UserHeaderLinks.js";
import Footer from "/components/Footer/Footer.js";
import Button from "/components/CustomButtons/Button.js";
import Parallax from "/components/Parallax/ParallaxUser.js";
import dynamic from "next/dynamic";

// 스타일 파일
import styles from "/styles/jss/nextjs-material-kit/pages/users.js";
import AOS from "aos";
import "aos/dist/aos.css";

// Import useRouter to access route parameters
import { useRouter } from "next/router";

// 다이나믹 import 테스트
const DynamicMyContainerMap = dynamic(
  () => import("/pages-sections/Components-Sections/MyContainerMap.jsx"),
  { ssr: false }
);
const DynamicMyContainerNavigation = dynamic(
  () => import("/pages-sections/Components-Sections/MyContainerNavigation.jsx"),
  { ssr: false }
);
const DynamicMyContainerProduct = dynamic(
  () => import("/pages-sections/Components-Sections/MyContainerProduct.jsx"),
  { ssr: false }
);

const useStyles = makeStyles(styles);

export default function Components(props) {
  const classes = useStyles();
  const { ...rest } = props;
  const router = useRouter();
  const { id } = router.query; // Destructure id from router.query to get the current warehouse ID

  useEffect(() => {
    AOS.init({
      duration: 100,
    });
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);

  const componentsArray = [
    <DynamicMyContainerMap key="DynamicMyContainerMap" />,
    <DynamicMyContainerNavigation key="DynamicMyContainerNavigation" />,
    <DynamicMyContainerProduct key="DynamicMyContainerProduct" />,
  ];

  const handleNextComponent = (index) => {
    setCurrentIndex(index);
  };

  return (
    /** 헤더 영역 */
    <div>
      <Header
        brand="FIT-BOX"
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
            <br />
            <div className={classes.flexContainer}>
              <div className={classes.currentWarehouse}>현재 창고 : {id}</div>
              <div className={classes.buttonsContainer}>
                <Button
                  color="primary"
                  round
                  onClick={() => handleNextComponent(0)}
                >
                  창고 관리
                </Button>
                <Button
                  color="info"
                  round
                  onClick={() => handleNextComponent(1)}
                >
                  재고 관리
                </Button>
                <Button
                  color="success"
                  round
                  onClick={() => handleNextComponent(2)}
                >
                  재고 현황
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
