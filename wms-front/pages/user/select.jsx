// pages/user/select.jsx

import React from "react";
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

import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/carouselStyle.js";
import { height } from "@mui/system";

const useStyles = makeStyles((theme) => ({
  ...styles,
  centerAlign: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  imageCard: {
    width: "30%", // 2/5 of the original size
    marginRight: theme.spacing(2),
  },
  cardImage: {
    height: "400px",
    width: "100%",
    borderRadius: "4px",
  },
  plusCard: {
    width: "30%", // same size as image card
    marginRight: theme.spacing(2),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
},
plusButton: {
    fontSize: "3rem", // slightly larger font size for visibility
},
cursor: "pointer",
buttonCard: {
    height: "450px",
    border: "2px solid #ccc",
    width: "100%",
    borderRadius: "4px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const Select = (props) => {
  const { ...rest } = props;

  const classes = useStyles();

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
            <GridItem xs={12} sm={12} md={4} className={classes.imageCard}>
              <Card>
                <img
                  src="/img/bg.jpg"
                  alt="Card image"
                  className={classes.cardImage}
                />
                <div>
                  <h4>1번 창고</h4>
                </div>
              </Card>
            </GridItem>
            {/* Plus Button Card */}
            <GridItem xs={12} sm={12} md={4} className={classes.plusCard}>
              <div className={classes.buttonCard}>
                <AddCircleOutline className={classes.plusButton} />
              </div>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    </div>
  );
};

export default Select;
