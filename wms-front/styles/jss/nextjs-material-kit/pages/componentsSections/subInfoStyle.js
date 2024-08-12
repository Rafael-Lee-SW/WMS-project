// SubInfoStyle.js

const subInfoStyle = {
    container: {
      paddingTop: '20px',
      textAlign: "center",
    },
    card: {
      cursor: "pointer",
      marginBottom: "10px",
      padding: "10px",
      border: "1px solid lightgray",
      borderRadius: "5px",
      transition: "transform 0.2s ease-in-out",
      "&:hover": {
        transform: "scale(1.05)",
      },
    },
    button: {
      margin: "10px",
      backgroundColor: "#1976d2",
      color: "#fff",
      "&:hover": {
        backgroundColor: "#1565c0",
      },
    },
    modalCloseButton: {
      backgroundColor: "red",
      color: "white",
      border: "none",
      borderRadius: "4px",
      padding: "5px 10px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#c62828",
      },
    },
    title: {
      marginBottom: "20px",
      margin: 0
    },
    loadingText: {
      fontSize: "18px",
      color: "gray",
    },
    contentText: {
      marginBottom: "10px",
      fontSize: "16px",
    },
  };
  
  export default subInfoStyle;
  