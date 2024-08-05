// pages/user/select.jsx

import React, { useState } from "react";
import Link from "next/link"; // Import the Link component from Next.js
import Header from "../../components/Header/SelectHeader";
import HeaderLinks from "/components/Header/SelectHeaderLinks.js";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import AddCircleOutline from "@material-ui/icons/AddCircleOutline";
// core components
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import Card from "/components/Card/Card.js";

//Material ui
import { Modal, Backdrop, Fade, Button, TextField } from "@mui/material";

// Import styles from the selectStyle.js
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/selectStyle.js";

const useStyles = makeStyles(styles);

const Select = (props) => {
  const { ...rest } = props;
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    containerName: "",
    containerXSize: "",
    containerYSize: "",
    locationX: "",
    locationY: "",
    locationZ: "",
    row: "",
    column: "",
  });

  const [cards, setCards] = useState([
    {
      id: 1,
      title: "1번 창고",
      image: "/img/bg.jpg",
    },
  ]);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to create a new card
    const newCard = {
      id: cards.length + 1,
      title: formData.containerName || `Container ${cards.length + 1}`,
      image: "/img/bg.jpg", // Change to your desired image or logic to set a different one
    };

    setCards((prev) => [...prev, newCard]);
    handleClose();
  };

  return (
    <div>
      {/* Header */}
      <Header
        brand="FitBox"
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

      {/* Card Section */}
      <div className={classes.section}>
        <div className={classes.container}>
          <h3>창고를 선택하세요.</h3>
          <GridContainer>
            {/* Image Card */}
            {cards.map((card) => (
              <GridItem key={card.id} xs={12} sm={12} md={4}>
                
                <Link href={`/user/${card.id}`} passHref>
                  <Card
                    component="a"
                    className={`${classes.cardLink} ${classes.imageCard}`}
                  >
                    {/* Card is wrapped in Link */}
                    <img
                      src="/img/bg.jpg"
                      alt="Card image"
                      className={classes.cardImage}
                    />
                    <div>
                      <h4>{card.title}</h4>
                    </div>
                  </Card>
                </Link>
              </GridItem>
            ))}
            {/* Plus Button Card */}
            <GridItem xs={12} sm={12} md={4} className={classes.plusCard}>
              <div className={classes.buttonCard} onClick={handleOpen}>
                <AddCircleOutline className={classes.plusButton} />
              </div>
            </GridItem>
          </GridContainer>
          {/* Modal for input form */}
          <Modal
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
          >
            <Fade in={open}
            style={{
              justifyContent:"center"
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
                  />
                  <TextField
                    name="containerXSize"
                    label="창고 가로 크기"
                    fullWidth
                    variant="outlined"
                    className={classes.formControl}
                    value={formData.containerXSize}
                    onChange={handleChange}
                  />
                  <TextField
                    name="containerYSize"
                    label="창고 세로 크기"
                    fullWidth
                    variant="outlined"
                    className={classes.formControl}
                    value={formData.containerYSize}
                    onChange={handleChange}
                  />
                  <TextField
                    name="locationX"
                    label="Location(적재함) 가로 크기"
                    fullWidth
                    variant="outlined"
                    className={classes.formControl}
                    value={formData.locationX}
                    onChange={handleChange}
                  />
                  <TextField
                    name="locationY"
                    label="Location(적재함) 세로 크기"
                    fullWidth
                    variant="outlined"
                    className={classes.formControl}
                    value={formData.locationY}
                    onChange={handleChange}
                  />
                  <TextField
                    name="locationZ"
                    label="Location(적재함) 층수"
                    fullWidth
                    variant="outlined"
                    className={classes.formControl}
                    value={formData.locationZ}
                    onChange={handleChange}
                  />
                  <TextField
                    name="row"
                    label="행"
                    fullWidth
                    variant="outlined"
                    className={classes.formControl}
                    value={formData.row}
                    onChange={handleChange}
                  />
                  <TextField
                    name="column"
                    label="열"
                    fullWidth
                    variant="outlined"
                    className={classes.formControl}
                    value={formData.column}
                    onChange={handleChange}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
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
