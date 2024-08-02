// styles\jss\nextjs-material-kit\pages\componentsSections\MyContainerStyle.jsx

import { container, title } from "/styles/jss/nextjs-material-kit.js";
import customCheckboxRadioSwitch from "/styles/jss/nextjs-material-kit/customCheckboxRadioSwitch.js";

const basicsStyle = {
  sections: {
    padding: "1% 0"
  },
  container,
  title: {
    ...title,
    marginTop: "30px",
    minHeight: "32px",
    textDecoration: "none",
  },
  flexContainer: {
    display: "flex",
    justifyContent: "space-between", // Aligns items with space between them
    alignItems: "center", // Aligns items vertically centered
  },
  buttonsContainer: {
    display: "flex",
    justifyContent: "flex-end", // Aligns items to the right
    alignItems: "center", // Aligns items vertically centered
  },
  space50: {
    height: "50px",
    display: "block"
  },
  space70: {
    height: "70px",
    display: "block"
  },
  icons: {
    width: "17px",
    height: "17px",
    color: "#FFFFFF"
  },
  ...customCheckboxRadioSwitch
};

export default basicsStyle;
