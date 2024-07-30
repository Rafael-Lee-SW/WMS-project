const subStyle = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center', // 텍스트 중앙 정렬
    backgroundImage: "url('/img/subscribe.jpg')",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backgroundBlendMode: "overlay",
  },
  header: {
    marginBottom: '16px', // 예시: 2 * 8px = 16px
  },
  subheader: {
    marginBottom: '16px', // 예시: 2 * 8px = 16px
  },
  divider: {
    width: '60%',
    marginBottom: '32px', // 예시: 4 * 8px = 32px
    marginTop: '24px', // 예시: 3 * 8px = 24px
  },
  button: {
    margin: '8px', // 예시: 1 * 8px = 8px
    width: '300px',
    height: '50px',
    color: '#000',
    borderColor: '#000',
    backgroundColor: '#fff',
  },
};

export default subStyle;
