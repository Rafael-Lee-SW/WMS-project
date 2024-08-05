import React, { useEffect, useRef } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// react components for routing our app without refresh
import Link from "next/link";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Header from "/components/Header/HomeHeader.js";
import HeaderLinks from "/components/Header/HomeHeaderLinks.js";
import HowToUse from "../components/Main/HowToUse";
import Footer from "/components/Footer/Footer.js";
import Parallax from "/components/Parallax/Parallax.js";
import Slider from "react-slick"; 
import ServiceInfo from '/components/Main/ServiceInfo';

import styles from "/styles/jss/nextjs-material-kit/pages/components.js";
import AOS from 'aos';
import 'aos/dist/aos.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const useStyles = makeStyles(styles);

const Components = (props) => {
  const classes = useStyles();
  const { ...rest } = props;

  useEffect(() => {
    AOS.init({
      duration: 1200,
    });
  }, []);

  // 캐러셀 설정
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div>
      <Header
        brand="FIT-BOX"
        rightLinks={<HeaderLinks/>}
        fixed
        color="transparent"
        changeColorOnScroll={{
          height: 400,
          color: "white"
        }}
        {...rest}
      />
      <Parallax>
        <div style={{ width: '100%', margin: '0 auto' }}>
          <Slider {...settings}>
            <div>
              <img src="/img/main1.jpg" alt="First slide" style={{ width: '100%', height: 'auto' }} />
            </div>
            <div>
              <img src="/img/main2.jpg" alt="Second slide" style={{ width: '100%', height: 'auto' }} />
            </div>
            <div>
              <img src="/img/main3.jpg" alt="Third slide" style={{ width: '100%', height: 'auto' }} />
            </div>
          </Slider>
        </div>
      </Parallax>
      <ServiceInfo/>
    </div>
  );
};

export default Components;
