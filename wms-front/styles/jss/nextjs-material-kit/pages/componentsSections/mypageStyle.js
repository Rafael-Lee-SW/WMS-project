const mypageStyle = {
  container: {
    display: 'flex',
    height: '100vh',
  },
  leftPanel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingLeft: '16px',
    flex: '2', // 왼쪽 패널의 비율을 2로 설정합니다.
    backgroundColor: '#f0f0f0', 
  },
  rightPanel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '20px',
    flex: '8', // 오른쪽 패널의 비율을 8로 설정합니다.
    backgroundColor: '#ffffff',
    textAlign: 'center'
  },
};

export default mypageStyle;