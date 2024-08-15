import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import Header from "../../components/Header/HomeHeader";
import HeaderLinks from "/components/Header/HomeHeaderLinks.js";
import { makeStyles } from "@material-ui/core/styles";
import AddCircleOutline from "@material-ui/icons/AddCircleOutline";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import CardSelect from "/components/Card/CardSelect.js";
import {
  Modal,
  Fade,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import { useRouter } from "next/router";
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/selectStyle.js";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles(styles);

const Select = (props) => {
  const { ...rest } = props;
  const classes = useStyles();
  const router = useRouter();

  const notify = (message) => toast(message, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

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
      notify("추가 생성을 위한 결제가 필요합니다.");
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
        router.push('/404');
      }
    } catch (error) {
      router.push('/404');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    if (!businessId) {
      router.push('/404');
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

    // Calculate fixed spacing between columns and rows
    const columnSpacing = 10; // Fixed spacing of 10px between columns
    const rowSpacing = parseInt(locationY); // Distance between rows equal to the height of each location

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
          xPosition: xPosition,
          yPosition: yPosition,
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

        const locationsResponse = await fetch(
          `https://i11a508.p.ssafy.io/api/warehouses/${warehousesId}/locations`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(locationData),
          }
        );

        if (locationsResponse.ok) {
          const newLocations = await locationsResponse.json();

          const wallsResponse = await fetch(
            `https://i11a508.p.ssafy.io/api/warehouses/${warehousesId}/walls`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(wallData),
            }
          );

          if (wallsResponse.ok) {
            notify("생성되었습니다.");
            setCards([...cards, postData]);
            setOpen(false);
          } else {
            notify("Wall creation failed");
          }
        } else {
          notify("Location creation failed");
        }
      } else {
        notify("Container creation failed");
      }
    } catch (error) {
      notify("An error occurred. Please try again.");
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (confirmDelete) {
      try {
        const response = await fetch(`https://i11a508.p.ssafy.io/api/warehouses/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          notify("삭제되었습니다.");
          setCards(cards.filter((card) => card.id !== id));
        } else {
          notify("삭제 실패");
        }
      } catch (error) {
        notify("삭제 중 오류 발생");
      }
    }
  };

  useEffect(() => {
    // Fetch user and business data
    (async () => {
      try {
        const userResponse = await axios.get("https://i11a508.p.ssafy.io/api/user");
        setUserData(userResponse.data);

        const businessResponse = await axios.get(`https://i11a508.p.ssafy.io/api/business/${userResponse.data.businessId}`);
        setBusinessData(businessResponse.data);
        setBusinessId(userResponse.data.businessId);

        const { presentCount, MaxCount } = await fetchWarehouseCounts(userResponse.data.businessId);
        setCurrentWarehouseCount(presentCount);
        setAllowedWarehouseCount(MaxCount);
      } catch (error) {
        console.error("Error fetching data", error);
        router.push('/404');
      }
    })();
  }, [router]);

  return (
    <>
      <Header
        color="transparent"
        brand="Your Brand"
        rightLinks={<HeaderLinks />}
        fixed
        changeColorOnScroll={{
          height: 400,
          color: "white",
        }}
        {...rest}
      />
      <div className={classes.pageHeader}>
        <div className={classes.container}>
          <div className={classes.title}>
            <h1>생성된 창고 리스트</h1>
          </div>
          <GridContainer>
            {cards.map((card) => (
              <GridItem xs={12} sm={6} md={4} lg={3} key={card.id}>
                <CardSelect
                  image={card.image || "/img/placeholder.jpg"} // default image
                  title={card.title}
                  description={card.description}
                  onDelete={(e) => handleDelete(card.id, e)}
                />
              </GridItem>
            ))}
            <GridItem xs={12} sm={6} md={4} lg={3}>
              <Button
                color="primary"
                onClick={handleOpen}
                startIcon={<AddCircleOutline />}
              >
                Add New
              </Button>
            </GridItem>
          </GridContainer>

          <Modal
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropProps={{ timeout: 500 }}
          >
            <Fade in={open}>
              <div className={classes.modal}>
                <h2>Create New Warehouse</h2>
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Container Name"
                    name="containerName"
                    value={formData.containerName}
                    onChange={handleChange}
                    error={!!validationErrors.containerName}
                    helperText={validationErrors.containerName}
                    fullWidth
                  />
                  <TextField
                    label="Container Size (px)"
                    name="containerSize"
                    type="number"
                    value={formData.containerSize}
                    onChange={handleChange}
                    error={!!validationErrors.containerSize}
                    helperText={validationErrors.containerSize}
                    fullWidth
                  />
                  <TextField
                    label="Location X (px)"
                    name="locationX"
                    type="number"
                    value={formData.locationX}
                    onChange={handleChange}
                    error={!!validationErrors.locations}
                    helperText={validationErrors.locations}
                    fullWidth
                  />
                  <TextField
                    label="Location Y (px)"
                    name="locationY"
                    type="number"
                    value={formData.locationY}
                    onChange={handleChange}
                    error={!!validationErrors.locations}
                    helperText={validationErrors.locations}
                    fullWidth
                  />
                  <TextField
                    label="Location Z (px)"
                    name="locationZ"
                    type="number"
                    value={formData.locationZ}
                    onChange={handleChange}
                    error={!!validationErrors.locationZ}
                    helperText={validationErrors.locationZ}
                    fullWidth
                  />
                  <TextField
                    label="Row"
                    name="row"
                    type="number"
                    value={formData.row}
                    onChange={handleChange}
                    error={!!validationErrors.locations}
                    helperText={validationErrors.locations}
                    fullWidth
                  />
                  <TextField
                    label="Column"
                    name="column"
                    type="number"
                    value={formData.column}
                    onChange={handleChange}
                    error={!!validationErrors.locations}
                    helperText={validationErrors.locations}
                    fullWidth
                  />
                  <FormControl component="fieldset" className={classes.formControl}>
                    <FormLabel component="legend">Facility Type</FormLabel>
                    <RadioGroup
                      aria-label="facilityType"
                      name="facilityType"
                      value={facilityType}
                      onChange={handleFacilityTypeChange}
                    >
                      <FormControlLabel value="STORE" control={<Radio />} label="Store" />
                      <FormControlLabel value="OTHER" control={<Radio />} label="Other" />
                    </RadioGroup>
                  </FormControl>
                  {facilityType === "OTHER" && (
                    <TextField
                      label="Priority"
                      name="priority"
                      type="number"
                      value={priority}
                      onChange={handlePriorityChange}
                      fullWidth
                    />
                  )}
                  <Button type="submit" color="primary">
                    Submit
                  </Button>
                </form>
              </div>
            </Fade>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default Select;
