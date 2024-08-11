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
    width: "90px", // Set a consistent width
    height: "100vh",
    position: "fixed",
    top: 0,
    left: 0,
    backgroundColor: "#f7f7f7",
    padding: "5px 5px 15px 5px",
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
    marginLeft: "90px", // Align with sidebar width
    width: "calc(100% - 80px)", // Take full width minus sidebar width
    height: "100vh", // Fill the screen height
    overflow: "auto", // Allow scrolling if needed
  },
  warehouseDropdown: {
    margin: "10px 0",
  },
  warehouseSelect: {
    width: "100%",
    padding: "5px", // Increased padding for better visibility
    fontSize: "12px", // Larger font size for emphasis
    fontWeight: "bold", // Bold text to highlight the title
    borderRadius: "4px",
    border: "1px solid #ccc",
    backgroundColor: "#fff", // Clean background color
    cursor: "pointer", // Indicate interactiveness
    appearance: "none", // Remove default styling
    whiteSpace: "normal", // Enable text wrapping
  },
  warehouseOption: {
    fontSize: "12px", // Ensure options also have larger font
    fontWeight: "bold", // Consistent emphasis
    lineHeight: "1.2", // Allow for multi-line text
    whiteSpace: "normal", // Enable text wrapping
    overflow: "hidden", // Prevent overflow of text
    padding: "10px", // Consistent padding
  },
}));

export default function Components(props) {
  const classes = useStyles();
  const { ...rest } = props;
  const router = useRouter();
  const { id } = router.query; // Destructure id from router.query to get the current warehouse ID

  const [cards, setCards] = useState([]);
  const [userData, setUserData] = useState(null); // State to store user data
  const [businessData, setBusinessData] = useState(null); // State to store business data

  const [selectedWarehouse, setSelectedWarehouse] = useState(id || ""); // State for selected warehouse

  /*
   * 유저 정보와 창고 정보를 받아오는 UseEffect 및 함수 정의
   */

  // API call to fetch warehouse information // 해당 비즈니스 아이디의 창고 정보
  const getAllWarehouseInfoAPI = async (businessId) => {
    try {
      const response = await fetch(
        `https://i11a508.p.ssafy.io/api/warehouses?businessId=${businessId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const apiConnection = await response.json();
        console.log(apiConnection);
        const warehouses = apiConnection.result;

        const warehouseCards = warehouses.map((warehouse) => ({
          id: warehouse.id,
          title: warehouse.name,
        }));

        setCards(warehouseCards);
      } else {
        console.error("Error loading warehouse data");
      }
    } catch (error) {
      console.error("Error loading warehouse data:", error);
    }
  };

  const fetchBusinessData = async (userId) => {
    try {
      const response = await fetch(
        `https://i11a508.p.ssafy.io/api/users/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const userData = await response.json();
        const businessInfo = userData.result;
        setBusinessData(businessInfo); // Store business data in state
        console.log("Business data loaded:", businessInfo);

        // Now call the warehouse info API with the business ID
        getAllWarehouseInfoAPI(businessInfo.businessId);
      } else {
        console.error("Error fetching user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  /**
   * UseEffect Part
   */

  useEffect(() => {
    // Retrieve user data from localStorage
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setUserData(parsedUser);
        console.log("User data loaded from localStorage:", parsedUser);

        // Fetch business data using user ID
        fetchBusinessData(parsedUser.id);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);

  const componentsArray = [
    <DynamicMyContainerMap
      key={`map-${selectedWarehouse}`}
      warehouseId={selectedWarehouse}
    />,
    <DynamicMyContainerNavigation
      key={`nav-${selectedWarehouse}`}
      WHId={selectedWarehouse}
    />,
    <DynamicMyContainerProduct
      key={`product-${selectedWarehouse}`}
      WHId={selectedWarehouse}
    />,
  ];

  const handleNextComponent = (index) => {
    setCurrentIndex(index);
  };

  const handleWarehouseChange = (event) => {
    const warehouseId = event.target.value;
    setSelectedWarehouse(warehouseId);
    // Redirect to the new warehouse page with shallow routing
    router.push(`/user/${warehouseId}`, undefined, { shallow: true });
  };

  useEffect(() => {
    // Update effect when selectedWarehouse changes
    console.log(`Current selected warehouse ID: ${selectedWarehouse}`);
  }, [selectedWarehouse]);

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
        <div className={classes.warehouseDropdown}>
          <select
            className={classes.warehouseSelect}
            value={selectedWarehouse}
            onChange={handleWarehouseChange}
          >
            <option value="" disabled>
              창고를 선택하세요
            </option>
            {cards.map((warehouse) => (
              <option
                key={warehouse.id}
                value={warehouse.id}
                className={classes.warehouseOption}
              >
                {warehouse.title}
              </option>
            ))}
          </select>
        </div>
        <Button color="primary" round onClick={() => handleNextComponent(0)}>
          창고 관리
        </Button>
        <Button color="info" round onClick={() => handleNextComponent(1)}>
          재고 현황
        </Button>
        <Button color="success" round onClick={() => handleNextComponent(2)}>
          재고 관리
        </Button>
      </div>

      {/* Main Content Area */}
      <div className={classes.mainContent}>{componentsArray[currentIndex]}</div>
    </div>
  );
}
