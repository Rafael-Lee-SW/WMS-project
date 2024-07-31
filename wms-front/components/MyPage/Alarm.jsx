import React, { useState } from 'react';
import { Card, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import style from '/styles/jss/nextjs-material-kit/effect/modalStyle.js'

const useStyles = makeStyles(style)

// 알람 리스트 페이지
export default function Alarm({ notifications }) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [currentNotification, setCurrentNotification] = useState(null);

    const handleOpen = (notification) => {
        setCurrentNotification(notification);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <h2>알람 목록</h2>
                {notifications ? (
                    notifications.map((notification) => (
                    <Card key={notification.id} onClick={() => handleOpen(notification)} style={{ cursor: 'pointer', marginBottom: '10px' }}>
                        <p>{notification.content}</p>
                    </Card>
                    ))
                ) : (
                <h4>알림이 없습니다.</h4>
                )}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>알람 상세 정보</DialogTitle>
                <DialogContent>
                    {currentNotification && (
                        <>
                            <p>내용 : {currentNotification.content}</p>
                            <p>알람 시간 : {currentNotification.createdDate}</p>
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
