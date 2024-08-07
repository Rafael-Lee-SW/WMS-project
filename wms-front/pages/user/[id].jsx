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

const useStyles = makeStyles((theme) => ({
  ...styles,
  // Add sidebar styles
  sidebar: {
    width: "80px", // Set a consistent width
    height: "100vh",
    position: "fixed",
    top: 0,
    left: 0,
    backgroundColor: "#f7f7f7",
    padding: "5px 15px 20px 15px",
    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    zIndex: 1200,
  },
  content: {
    padding: "20px",
  },
  currentWarehouseIndex: {
    fontSize: "12px",
  },
  currentWarehouse: {
    marginBottom: "20px",
    fontWeight: "bold",
  },
  mainContent: {
    marginLeft: "80px", // Align with sidebar width
    width: "calc(100% - 80px)", // Take full width minus sidebar width
    height: "100vh", // Fill the screen height
    overflow: "auto", // Allow scrolling if needed
  },
}));

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
    <DynamicMyContainerMap key="DynamicMyContainerMap" warehouseId={id} />,
    <DynamicMyContainerNavigation
      key="DynamicMyContainerNavigation"
      WHId={id}
    />,
    <DynamicMyContainerProduct key="DynamicMyContainerProduct" WHId={id} />,
  ];

  const handleNextComponent = (index) => {
    setCurrentIndex(index);
  };

  return (
    /** 헤더 영역 */
    <div>
      <Header
        rightLinks={<HeaderLinks />}
        fixed
        color="rgba(237, 237, 237, 0.8)"
        {...rest}
      />
      {/* Sidebar */}
      <div className={classes.sidebar}>
        <button>
          <Link href="/components" as="/components">
            <img
              style={{ height: "30px", width: "60px", paddingRight: "15px" }}
              src="/img/logo1.png"
              alt="logo"
            />
          </Link>
        </button>
        <br />
        <div className={classes.currentWarehouseIndex}>현재 창고</div>
        <div className={classes.currentWarehouse}>{id}번</div>
        <Button color="primary" round onClick={() => handleNextComponent(0)}>
          창고 관리
        </Button>
        <Button color="info" round onClick={() => handleNextComponent(1)}>
          재고 관리
        </Button>
        <Button color="success" round onClick={() => handleNextComponent(2)}>
          재고 현황
        </Button>
      </div>

      {/* Main Content Area */}
      <div className={classes.mainContent}>
        {componentsArray[currentIndex]}
      </div>
    </div>
  );
}
