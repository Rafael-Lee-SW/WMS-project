import React, { useEffect, useState } from 'react';
import { Card, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import style from '/styles/jss/nextjs-material-kit/effect/modalStyle.js'
import { fetchNotifications } from '../../pages/api';
import { useRouter } from 'next/router';

const useStyles = makeStyles(style)

// 알람 리스트 Component
export default function Alarm({ businessId }) {
    const classes = useStyles();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([])
    const [currentNotification, setCurrentNotification] = useState(null);

    useEffect(() => {
        getNotifications();
    }, []);

    const getNotifications = async () => {
        try {
            const response = await fetchNotifications(businessId);
            const notifications = response.data.result.productFlowResponseDtos;
            
            setNotifications(notifications);
        } catch (error) {
            console.log(error)
            router.push('/404');
        }
    }

    const handleOpen = (notification) => {
        setCurrentNotification(notification);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <h3>알람 목록</h3>
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                    <Card key={notification.id} onClick={() => handleOpen(notification)} style={{ cursor: 'pointer', marginBottom: '10px' }}>
                        <p>{notification.content}</p>
                    </Card>
                    ))
                ) : (
                <h4 style={{ paddingTop: '30px' }}>알림이 없습니다.</h4>
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
