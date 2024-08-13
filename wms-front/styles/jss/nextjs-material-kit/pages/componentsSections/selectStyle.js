import { container } from "/styles/jss/nextjs-material-kit.js";

const selectStyle = theme => ({
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
    width: "90%", // Adjusted from the original size
    borderRadius: "20px",
    marginRight: theme.spacing(2),
    "&:hover": {
      cursor: "pointer", // Cursor changes to pointer on hover
    },
  },
  cardImage: {
    height: "400px",
    width: "100%",
    borderRadius: "20px 20px 0 0",
  },
  plusCard: {
    width: "30%", // Same size as the image card
    marginRight: theme.spacing(2),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  plusButton: {
    fontSize: "3rem", // Slightly larger for visibility
    cursor: "pointer", // Cursor is pointer for the plus button too
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
    maxWidth: "500px", // Maximum width of the modal
    margin: "auto",
  },
  formControl: {
    marginBottom: theme.spacing(2),
  },
  cardSelect: {
    display: "flex",
    flexDirection: "column",
    height: "300px", // Total height of the card
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "33.33%", // Height set to 1/3 of the card
    backgroundColor: "rgb(27, 177, 231)", // Apply the blue color
  },
  cardBody: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "33.33%", // Height set to 1/3 of the card
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-around", // Evenly space elements in the footer
    height: "33.33%", // Height set to 1/3 of the card
  },
  pcsContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px", // Gap between image and text
  },
  locationContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px", // Gap between image and text
  },
  containerImage: {
    width: "30px",
    height: "auto",
  },
  gradientLine: {
    height: "2px",
    background: "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(27,177,231,1) 50%, rgba(255,255,255,0) 100%)",
    margin: "10px 0", // Margin around the line
  },
   gradientHr: {
    height: "1px",
    background: "#bbb", // 기본 배경 색상
    backgroundImage: "linear-gradient(to right, #eee 0%, #777 50%, #eee 100%)", // 표준 문법
  }
});

export default selectStyle;
