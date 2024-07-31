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
    flex: '2', // 왼쪽 패널의 비율을 2로 설정합니다.
    backgroundColor: '#ffffff', 
  },
  rightPanel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '100px',
    flex: '8', // 오른쪽 패널의 비율을 8로 설정합니다.
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
    marginTop: '20px',
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
  },
  rendering: {
    paddingRight: '100px',
    paddingTop: '20px'
  }
};

export default mypageStyle;