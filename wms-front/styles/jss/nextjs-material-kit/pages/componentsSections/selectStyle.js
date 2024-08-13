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
    height: "450px", // Total height of the card
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "33.33%", // Height set to 1/3 of the card
    backgroundColor: "rgb(27, 177, 231)", // 기본 배경 색상은 JSX에서 동적으로 설정
    position: "relative", // 이미지 포지셔닝을 위해 설정
  },
  warehouseImage: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  cardBody: {
    display: "flex",
    flexDirection: "column", // 제목과 퍼센트 바를 세로로 정렬
    justifyContent: "center",
    alignItems: "center",
    height: "33.33%", // Height set to 1/3 of the card
  },
  usageBarContainer: {
    width: "100%",
    height: "20px",
    backgroundColor: "lightgray",
    borderRadius: "4px",
    overflow: "hidden",
    marginTop: "10px",
  },
  usageBar: {
    height: "100%",
    backgroundColor: "rgb(27, 177, 231)", // 기본 배경 색상은 JSX에서 동적으로 설정
  },
  cardFooter: {
    display: "flex",
    justifyContent: "center", // 요소를 가운데 정렬하여 간격 줄임
    alignItems: "center", // 수직 정렬
    gap: "100px", // pcsContainer와 locationContainer 사이 간격
    height: "33.33%", // 카드의 1/3 높이
  },
  pcsContainer: {
    display: "flex",
    alignItems: "center",
    gap: "1px", // 이미지와 텍스트 사이의 간격
  },
  locationContainer: {
    display: "flex",
    alignItems: "center",
    gap: "1px", // 이미지와 텍스트 사이의 간격
  },
  containerImage: {
    width: "40px",
    height: "auto",
  },
  gradientLine: {
    height: "2px",
    background: "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(27,177,231,1) 50%, rgba(255,255,255,0) 100%)",
    margin: "10px 0", // Margin around the line
  },
  gradientHr: {
    height: "1px",
    background: "black", // 기본 배경 색상
    backgroundImage: "linear-gradient(to right, #eee 0%, #777 50%, #eee 100%)", // 표준 문법
  }
});

export default selectStyle;
