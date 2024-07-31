import React, { useEffect, useState } from "react";
// core components
import Header from "/components/Header/UserHeader.jsx";
import HeaderLinks from "/components/Header/HomeHeaderLinks.js";
import Footer from "/components/Footer/Footer.js";
import Parallax from "/components/Parallax/ParallaxUser.js";
// dynamic import
import dynamic from "next/dynamic";

//what is the problem?
import Button from "/components/CustomButtons/Button.js";

// AOS animation
import AOS from "aos";
import "aos/dist/aos.css";

// 스타일 파일
import styles from "/styles/jss/nextjs-material-kit/pages/users.js";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(styles);

// dynamic imports
const DynamicMyContainer = dynamic(
  () => import("/pages-sections/Components-Sections/MyContainer.jsx"),
  { ssr: false }
);
const DynamicMyContainerDual = dynamic(
  () => import("/pages-sections/Components-Sections/MyContainerDual.jsx"),
  { ssr: false }
);
const DynamicMyContainerProduct = dynamic(
  () => import("/pages-sections/Components-Sections/MyContainerProduct.jsx"),
  { ssr: false }
);

export default function Components(props) {

  const classes = useStyles();
  const { ...rest } = props;

  useEffect(() => {
    AOS.init({
      duration: 100,
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
          color: "white",
        }}
        {...rest}
      />
      <Parallax image="/img/WareHouseWallpaper.png">
        <div>
          <div>
            <h1>내 창고</h1>
          </div>
        </div>
      </Parallax>

      <div>
        <br />

        <hr />
        {/* 메인 영역 */}
        <DynamicMyContainerProduct />
      </div>
      <Footer />
    </div>
  );
}
