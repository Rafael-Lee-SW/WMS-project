const mypageStyle = {
  container: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
  },
  leftPanel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingLeft: '50px',
    paddingTop: '70px',
    flex: '2',
    backgroundColor: '#ffffff', 
  },
  rightPanel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '100px',
    flex: '8', 
    backgroundColor: '#ffffff',
    textAlign: 'center',
  },
  divContainer: {
    border: '1px solid #000',
    borderRadius: '8px',
    padding: '20px',
    margin: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  h2: {
    margin: '20px'
  },
  divHr: {
    width: '90%',
    borderTop: '1px solid #000',
    marginTop: '14px',
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    paddingLeft: '10px'
  },
  rendering: {
    width: '100%',
    top: '20px',
    left: '0',
  }
};

export default mypageStyle;