import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../../components/Header/SelectHeader";
import HeaderLinks from "/components/Header/SelectHeaderLinks.js";
import { makeStyles } from "@material-ui/core/styles";
import AddCircleOutline from "@material-ui/icons/AddCircleOutline";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import CardSelect from "/components/Card/CardSelect.js"; // Ensure correct path
import { Modal, Fade, Button, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from "@mui/material";
import { useRouter } from "next/router";
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/selectStyle.js";

const useStyles = makeStyles(styles);

const Select = (props) => {
  const { ...rest } = props;
  const classes = useStyles();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    containerName: "",
    containerSize: "",
    locationX: "",
    locationY: "",
    locationZ: "",
    row: "",
    column: "",
  });

  const [facilityType, setFacilityType] = useState("STORE");
  const [priority, setPriority] = useState(1);

  const [cards, setCards] = useState([]);
  const [userData, setUserData] = useState(null);
  const [businessData, setBusinessData] = useState(null);
  const [businessId, setBusinessId] = useState(null);
  const [currentWarehouseCount, setCurrentWarehouseCount] = useState(0);
  const [allowedWarehouseCount, setAllowedWarehouseCount] = useState(0);

  const [validationErrors, setValidationErrors] = useState({});

  const handleOpen = async () => {
    const { presentCount, MaxCount } = await fetchWarehouseCounts(businessId);

    if (presentCount >= MaxCount) {
      alert("추가 생성을 위한 결제가 필요합니다.");
      router.push("/payment");
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateForm({ ...formData, [name]: value });
  };

  const handleFacilityTypeChange = (e) => {
    setFacilityType(e.target.value);
    if (e.target.value === "STORE") {
      setPriority(1);
    }
  };

  const handlePriorityChange = (e) => {
    setPriority(e.target.value);
  };

  const validateForm = (data) => {
    const errors = {};

    if (data.containerName.length > 20) {
      errors.containerName = "20글자를 초과했습니다.";
    }

    const containerSize = parseInt(data.containerSize, 10);
    if (isNaN(containerSize) || containerSize < 300 || containerSize > 10000) {
      errors.containerSize = "잘못된 입력입니다.";
    }

    const locationZ = parseInt(data.locationZ, 10);
    if (isNaN(locationZ) || locationZ < 1 || locationZ > 10) {
      errors.locationZ = "잘못된 입력입니다.";
    }

    const locationX = parseInt(data.locationX, 10);
    const locationY = parseInt(data.locationY, 10);
    const row = parseInt(data.row, 10);
    const column = parseInt(data.column, 10);

    if (
      isNaN(locationX) ||
      isNaN(locationY) ||
      isNaN(row) ||
      isNaN(column) ||
      locationX <= 0 ||
      locationY <= 0 ||
      row <= 0 ||
      column <= 0
    ) {
      errors.locations = "잘못된 입력입니다.";
    } else {
      const totalWidth = column * locationX;
      const totalHeight = row * locationY;
      if (totalWidth > containerSize || totalHeight > containerSize) {
        errors.locations = "적재함이 창고 크기를 초과합니다.";
      }
    }

    setValidationErrors(errors);
  };

  const fetchWarehouseCounts = async (businessId) => {
    try {
      const warehouseCountResponse = await fetch(
        `https://i11a508.p.ssafy.io/api/warehouses/cnt/${businessId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const subscriptionResponse = await fetch(
        `https://i11a508.p.ssafy.io/api/subscriptions?businessId=${businessId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (warehouseCountResponse.ok && subscriptionResponse.ok) {
        const warehouseCountData = await warehouseCountResponse.json();
        const subscriptionData = await subscriptionResponse.json();
        const subscriptionCntDat = subscriptionData.result;

        const presentCount = warehouseCountData.result;
        const MaxCount = subscriptionCntDat[0].warehouseCount;

        setCurrentWarehouseCount(warehouseCountData.result);
        setAllowedWarehouseCount(subscriptionCntDat[0].warehouseCount);

        return { presentCount, MaxCount };
      } else {
        console.error("Error fetching warehouse or subscription data");
      }
    } catch (error) {
      console.error("Error fetching warehouse or subscription data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    if (!businessId) {
      console.error("Business ID is missing");
      return;
    }

    const postData = {
      businessId,
      size: parseInt(formData.containerSize),
      columnCount: parseInt(formData.column),
      rowCount: parseInt(formData.row),
      name: formData.containerName || `Container ${cards.length + 1}`,
      priority: facilityType === "STORE" ? 1 : parseInt(priority),
      facilityTypeEnum: facilityType,
    };

    const { locationX, locationY, locationZ, row, column } = formData;

    const xSpacing = postData.size / row / 2;
    const ySpacing = postData.size / column / 2;

    const locationData = [];
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < column; j++) {
        // Format row and column numbers as two-digit strings
        const rowNumber = (i + 1).toString().padStart(2, "0"); // Convert to string and pad with zeros
        const columnNumber = (j + 1).toString().padStart(2, "0"); // Convert to string and pad with zeros

        // Calculate x and y positions with new spacing logic
        const xPosition = j * (parseInt(locationX) + columnSpacing);
        const yPosition = i * (parseInt(locationY) + rowSpacing);

        locationData.push({
          x: xPosition,
          y: yPosition,
          zSize: parseInt(locationZ),
          xSize: Math.round(parseInt(locationX)),
          ySize: Math.round(parseInt(locationY)),
          name: `${rowNumber}-${columnNumber}`,
          productStorageType: "상온",
          rotation: 0,
          touchableFloor: 2,
        });
      }
    }

    const wallData = generateWalls(locationData);

    try {
      const response = await fetch(
        "https://i11a508.p.ssafy.io/api/warehouses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        }
      );

      if (response.ok) {
        const newWarehouse = await response.json();
        const warehouses = newWarehouse.result;

        const warehousesId = warehouses.id;

        postLocationAPI(locationData, warehousesId);
        postWallAPI(wallData, warehousesId);

        console.log("New warehouse created:", newWarehouse);

        const newCard = {
          id: newWarehouse.result.id,
          title: newWarehouse.result.name,
          image: "/img/sign.jpg",
        };

        setCards((prev) => [...prev, newCard]);
        handleClose();
      } else {
        console.error("Error creating new warehouse");
      }
    } catch (error) {
      console.error("Error creating new warehouse:", error);
    }
  };

  const generateWalls = (generatedLocations) => {
    if (generatedLocations.length === 0) return null;

    let minX = Number.MAX_VALUE,
      minY = Number.MAX_VALUE,
      maxX = 0,
      maxY = 0;

    generatedLocations.forEach((location) => {
      minX = Math.min(minX, location.xPosition);
      minY = Math.min(minY, location.yPosition);
      maxX = Math.max(maxX, location.xPosition + location.xSize);
      maxY = Math.max(maxY, location.yPosition + location.ySize);
    });

    const wallData = [
      { startX: minX, startY: minY, endX: maxX, endY: minY },
      { startX: maxX, startY: minY, endX: maxX, endY: maxY },
      { startX: maxX, startY: maxY, endX: minX, endY: maxY },
      { startX: minX, startY: maxY, endX: minX, endY: minY },
    ];

    return wallData;
  };

  const postLocationAPI = async (requests, warehouseId) => {
    console.log("로케이션");

    const total = { requests, warehouseId };
    console.log(total);

    try {
      const response = await fetch(
        `https://i11a508.p.ssafy.io/api/locations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(total),
        }
      );

      if (response.ok) {
        console.log("Location data saved successfully");
      } else {
        console.error("Error saving map data");
      }
    } catch (error) {
      console.error("Error saving map data:", error);
    }
  };

  const postWallAPI = async (wallDtos, warehouseId) => {
    console.log("벽");
    const total = { wallDtos, warehouseId };
    console.log(total);

    try {
      const response = await fetch(
        `https://i11a508.p.ssafy.io/api/warehouses/walls`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(total),
        }
      );

      if (response.ok) {
        console.log("Walls data saved successfully");
      } else {
        console.error("Error saving map data");
      }
    } catch (error) {
      console.error("Error saving map data:", error);
    }
  };

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
          image: "/img/storeroom.webp",
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
        setBusinessData(businessInfo);
        setBusinessId(businessInfo.businessId);
        console.log("Business data loaded:", businessInfo);

        fetchWarehouseCounts(businessInfo.businessId);
        getAllWarehouseInfoAPI(businessInfo.businessId);
      } else {
        console.error("Error fetching user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setUserData(parsedUser);
        console.log("User data loaded from localStorage:", parsedUser);

        fetchBusinessData(parsedUser.id);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  return (
    <div>
      <Header
        brand="FIT-BOX"
        rightLinks={<HeaderLinks />}
        fixed
        color="white"
        opacity="0.5"
        changeColorOnScroll={{
          height: 400,
          color: "white",
        }}
        {...rest}
      />

      <div className={classes.section}>
        <div className={classes.container}>
          <h3>창고를 선택하세요. ({currentWarehouseCount}/{allowedWarehouseCount})</h3>
          <GridContainer>
            {cards.map((card) => (
              <GridItem key={card.id} xs={12} sm={12} md={4}>
                <Link href={`/user/${card.id}`} passHref>
                  <CardSelect
                    component="a"
                    className={`${classes.cardLink} ${classes.imageCard}`}
                  >
                    <div className={classes.cardSelect} >
                      <div className={classes.cardHeader}>
                        {/* Header Section Content */}
                      </div>
                      <div className={classes.cardBody}>
                        <h4>{card.title}</h4>
                      </div>
                      <hr className={classes.gradientHr} />
                      <div className={classes.cardFooter}>
                        <div className={classes.pcsContainer}>
                          <img src="/img/box.png" alt="pcsContainer" className={classes.containerImage} />
                          <div className="pcsCnt">{card.pcsCount}</div>
                        </div>

                        <div className={classes.locationContainer}>
                          <img src="/img/location.png" alt="location" className={classes.containerImage} />
                          <div className="locationCnt">{card.locationCount}</div>
                        </div>
                      </div>
                    </div>

                  </CardSelect>
                </Link>
              </GridItem>
            ))}
            <GridItem xs={12} sm={12} md={4} className={classes.plusCard}>
              <div className={classes.buttonCard} onClick={handleOpen}>
                <AddCircleOutline className={classes.plusButton} />
              </div>
            </GridItem>
          </GridContainer>
          <Modal
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
          >
            <Fade
              in={open}
              style={{
                justifyContent: "center",
              }}
            >
              <div className={classes.paper}>
                <h2>새 창고 정보 입력</h2>
                <form onSubmit={handleSubmit}>
                  <TextField
                    name="containerName"
                    label="창고 이름"
                    fullWidth
                    variant="outlined"
                    className={classes.formControl}
                    value={formData.containerName}
                    onChange={handleChange}
                    error={Boolean(validationErrors.containerName)}
                    helperText={
                      validationErrors.containerName || "20글자까지 가능합니다."
                    }
                    FormHelperTextProps={{
                      style: {
                        color: validationErrors.containerName ? "red" : "blue",
                      },
                    }}
                  />
                  <TextField
                    name="containerSize"
                    label="창고 크기"
                    fullWidth
                    variant="outlined"
                    className={classes.formControl}
                    value={formData.containerSize}
                    onChange={handleChange}
                    error={Boolean(validationErrors.containerSize)}
                    helperText={
                      validationErrors.containerSize ||
                      `창고 부지의 크기: ${formData.containerSize} * ${formData.containerSize} = ${Math.pow(
                        parseInt(formData.containerSize) || 0,
                        2
                      )}`
                    }
                    FormHelperTextProps={{
                      style: {
                        color: validationErrors.containerSize ? "red" : "blue",
                      },
                    }}
                  />
                  <TextField
                    name="locationX"
                    label="Location(적재함) 가로 크기"
                    fullWidth
                    variant="outlined"
                    className={classes.formControl}
                    value={formData.locationX}
                    onChange={handleChange}
                    error={Boolean(validationErrors.locations)}
                  />
                  <TextField
                    name="locationY"
                    label="Location(적재함) 세로 크기"
                    fullWidth
                    variant="outlined"
                    className={classes.formControl}
                    value={formData.locationY}
                    onChange={handleChange}
                    error={Boolean(validationErrors.locations)}
                  />
                  <TextField
                    name="locationZ"
                    label="Location(적재함) 층수"
                    fullWidth
                    variant="outlined"
                    className={classes.formControl}
                    value={formData.locationZ}
                    onChange={handleChange}
                    error={Boolean(validationErrors.locationZ)}
                    helperText={
                      validationErrors.locationZ || "1~10층까지 설정 가능합니다."
                    }
                    FormHelperTextProps={{
                      style: {
                        color: validationErrors.locationZ ? "red" : "blue",
                      },
                    }}
                  />
                  <TextField
                    name="row"
                    label="행"
                    fullWidth
                    variant="outlined"
                    className={classes.formControl}
                    value={formData.row}
                    onChange={handleChange}
                    error={Boolean(validationErrors.locations)}
                    helperText={
                      validationErrors.locations ||
                      "적재함 크기와 개수가 창고 크기를 초과할 수 없습니다."
                    }
                    FormHelperTextProps={{
                      style: {
                        color: validationErrors.locations ? "red" : "blue",
                      },
                    }}
                  />
                  <TextField
                    name="column"
                    label="열"
                    fullWidth
                    variant="outlined"
                    className={classes.formControl}
                    value={formData.column}
                    onChange={handleChange}
                    error={Boolean(validationErrors.locations)}
                  />
                  <FormControl component="fieldset" className={classes.formControl}>
                    <FormLabel component="legend">시설 유형</FormLabel>
                    <RadioGroup
                      aria-label="facilityType"
                      name="facilityType"
                      value={facilityType}
                      onChange={handleFacilityTypeChange}
                    >
                      <FormControlLabel value="STORE" control={<Radio />} label="매장" />
                      <FormControlLabel value="WAREHOUSE" control={<Radio />} label="창고" />
                    </RadioGroup>
                  </FormControl>
                  {facilityType === "WAREHOUSE" && (
                    <TextField
                      name="priority"
                      label="창고 출고 우선순위"
                      fullWidth
                      variant="outlined"
                      className={classes.formControl}
                      value={priority}
                      onChange={handlePriorityChange}
                      type="number"
                    />
                  )}

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={Object.keys(validationErrors).length > 0}
                  >
                    Finish
                  </Button>
                </form>
              </div>
            </Fade>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Select;
