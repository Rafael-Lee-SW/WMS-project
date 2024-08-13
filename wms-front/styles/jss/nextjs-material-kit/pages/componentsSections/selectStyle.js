// styles/jss/nextjs-material-kit/pages/componentsSections/selectStyle.js

import { container } from "/styles/jss/nextjs-material-kit.js";

const selectStyle = (theme) => ({
  section: {
    padding: "70px 0",
  },
  container,
  marginAuto: {
    marginLeft: "auto !important",
    marginRight: "auto !important",
  },
  centerAlign: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  imageCard: {
    width: "90%", // 2/5 of the original size
    borderRadius: "20px",
    marginRight: theme.spacing(2),
    "&:hover": {
      cursor: "pointer", // Change cursor to pointer on hover
    },
  },
  cardImage: {
    height: "400px",
    width: "100%",
    borderRadius: "20px 20px 0 0",
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
    cursor: "pointer", // Ensure cursor is pointer for the plus button too
  },
  buttonCard: {
    height: "450px",
    border: "2px solid #ccc",
    width: "100%",
    borderRadius: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    outline: "none",
    borderRadius: "8px",
    width: "80%", // Width of the modal content
    maxWidth: "500px", // Ensure the modal does not exceed this width
    margin: "auto",
  },
  formControl: {
    marginBottom: theme.spacing(2),
  },
  
});

export default selectStyle;
