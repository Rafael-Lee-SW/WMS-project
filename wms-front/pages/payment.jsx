import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, IconButton } from '@mui/material';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { useRouter } from 'next/router';
import axios from 'axios';

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

// Iamport 로드
const loadIamportScript = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.iamport.kr/v1/iamport.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

export default function Payment() {

  const classes = useStyles();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const pricePerItem = 10000;

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  useEffect(() => {
    const initializeIamport = async () => {
      try {
        await loadIamportScript();
        const IMP = window.IMP;
        IMP.init('imp68513146');
      } catch (error) {
        router.push('/404');
      }
    };

    initializeIamport();
  }, []);

  // 결제 요청 전송
  const requestPay = () => {
    const IMP = window.IMP;
    IMP.request_pay(
      {
        pg: 'html5_inicis',
        pay_method: 'card',
        merchant_uid: `mid_${new Date().getTime()}`,
        name: '창고',
        amount: quantity * pricePerItem,
        buyer_email: localStorage.user.email,
        buyer_name: localStorage.user.name,
        buyer_tel: '010-1111-1111',
        buyer_addr: '서울시 강남구 테헤란로',
        buyer_postcode: '12345'
      },
      (rsp) => {
        if (rsp.success) {
        axios({
          url: '{서버에서 결제 정보를 받을 엔드포인트}',
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            imp_uid: rsp.imp_uid,
            merchant_uid: rsp.merchant_uid,
          },
        })
          .then(() => {
            router.push('/components');
          })
          .catch (() => {
            router.push('/404');
          });
      } else {
        console.log(`${rsp.error_msg}`)
        router.push('/components');
      }
    }
  );
};

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
        <Button onClick={requestPay} variant="contained" className={classes.purchaseButton}>
          구매하기
        </Button>
      </div>
    </div>
  );
};


