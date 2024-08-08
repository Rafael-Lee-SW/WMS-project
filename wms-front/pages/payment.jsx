import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, IconButton } from '@mui/material';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

const useStyles = makeStyles({
  container: {
    paddingTop: '50px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    overflow: 'auto',
    padding: '16px',
  },
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    paddingBottom: '50px',
    fontSize: '20px'
  },
  card: {
    border: "2px solid #7D4A1A",
    borderRadius: '5%',
    padding: '16px',
    width: '80%',
    maxWidth: '350px',
    textAlign: 'center',
  },
  price: {
    margin: '16px 0',
    paddingTop: '30px',
    fontSize: '25px',
    color: '#7D4A1A',
    fontWeight: 'bold'
  },
  quantityContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButton: {
    margin: '0 8px',
  },
  pay: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '20px'
  },
  totalQuantity: {
    fontSize: '12px',
    paddingRight: '5px'
  },
  totalPrice: {
    fontSize: '20px',
    paddingRight: '10px',
    color: '#D40022'
  },
  purchaseButton: {
    backgroundColor: '#7D4A1A',
    width: '80%',
    color: 'white',
    '&:hover': {
      transform: 'scale(1.05)',
      backgroundColor: '#7D4A1A',
      color: 'white',
    },
    margin: '20px 20px'
  },
  divider: {
    height: '1px',
    width: '100%',
    backgroundColor: '#7d4a1a',
    margin: 0
  },
});

const PurchasePage = () => {
  const classes = useStyles();
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // useEffect(() => {
  //   const jqueryScript = document.createElement('script');
  //   jqueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
  //   jqueryScript.async = true;
  //   document.body.appendChild(jqueryScript);

  //   jqueryScript.onload = () => {
  //     const iamportScript = document.createElement('script');
  //     iamportScript.src = 'https://cdn.iamport.kr/js/iamport.payment-1.1.5.js';
  //     iamportScript.async = true;
  //     document.body.appendChild(iamportScript);
      
  //     return () => {
  //       document.body.removeChild(iamportScript);
  //       document.body.removeChild(jqueryScript);
  //     };
  //   };
  // }, []);

  // const handlePayment = () => {
  //   if (!window.IMP) return; 
  //   const { IMP } = window;
  //   IMP.init('imp76481065'); 

  //   const paymentData = {
  //     pg: 'html5_inicis', 
  //     pay_method: 'card', 
  //     merchant_uid: `mid_${new Date().getTime()}`,
  //     amount: quantity * pricePerItem,
  //     name: 'FitBox 창고',
  //     buyer_name: '구매자 이름',
  //     buyer_email: 'example@example.com',
  //   };

  //   IMP.request_pay(paymentData, response => {
  //     if (response.success) {
  //       alert('결제가 완료되었습니다.');
  //       console.log(response);
  //     } else {
  //       alert(`결제에 실패하였습니다. 에러 내용: ${response.error_msg}`);
  //       console.log(response);
  //     }
  //   });
  // };

  return (
    <div className={classes.container}>
      <h2 className={classes.title}>창고 구매하기</h2>
      <h3 className={classes.subtitle}>
        지금 창고 구매 후, <span style={{ color: '#D3C7B5', fontWeight: 'bold' }}>FitBox</span>의 서비스를 이용해보세요.
      </h3>
      <div className={classes.card}>
        <h3>창고</h3>
        <h4 className={classes.price}>{pricePerItem.toLocaleString()} 원 (개)</h4>
        <p>( 1개월 이용가능 )</p>
        <div style={{ marginTop: '50px' }} className={classes.divider}></div>
        <div className={classes.quantityContainer}>
          <IconButton className={classes.quantityButton} onClick={handleDecrease}>
            <RemoveIcon />
          </IconButton>
          <h4>{quantity}개</h4>
          <IconButton className={classes.quantityButton} onClick={handleIncrease}>
            <AddIcon />
          </IconButton>
        </div>
        <div style={{ marginBottom: '30px' }} className={classes.divider}></div>
        <div className={classes.pay}>
          <div>
            <p style={{ fontWeight: 'bold', margin: 0, paddingLeft: '10px' }}>총 금액</p>
          </div>
          <div>
            <span className={classes.totalQuantity}>총 수량 {quantity} 개 | </span>
            <span className={classes.totalPrice}>{(quantity * pricePerItem).toLocaleString()} 원</span>
          </div>
        </div>
        <Button onClick={handlePayment} variant="contained" className={classes.purchaseButton}>
          구매하기
        </Button>
      </div>
    </div>
  );
};

export default PurchasePage;
