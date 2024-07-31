import React, { useState } from 'react';
import { Card, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import style from '/styles/jss/nextjs-material-kit/effect/modalStyle.js'

const useStyles = makeStyles(style)

export default function SubInfo({ subscriptions }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);

  const handleOpen = (subscription) => {
    setCurrentSubscription(subscription);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <h2>구독 정보</h2>
        {subscriptions ? (
          subscriptions.map((subscription) => (
          <Card 
          key={subscription.id} 
          onClick={() => handleOpen(subscription)} 
          style={{ cursor: 'pointer', marginBottom: '10px', padding: '10px' }}
          >
            <p>구독 타입 : {subscription.subscriptionTypeEnum}</p>
            <p>구독 날짜 : {subscription.startDate}</p>
          </Card>
        ))
    ) : (
    <h4>구독 정보가 없습니다.</h4>
    )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>구독 상세 정보</DialogTitle>
        <DialogContent>
          {currentSubscription && (
            <>
              <p>구독 타입 : {currentSubscription.subscriptionTypeEnum}</p>
              <p>구독 날짜 : {currentSubscription.startDate}</p>
              <p>결제 방법 : {currentSubscription.paidTypeEnum}</p>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <button className={classes.modalCloseButton} onClick={handleClose} color="primary">
            X
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
