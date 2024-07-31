import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { deleteEmployee } from '../../pages/api';
import { Card } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import style from '/styles/jss/nextjs-material-kit/effect/modalStyle.js'

const useStyles = makeStyles(style)

// 직원관리
export default function ManageEmployees({employees}) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  
  const handleOpen = (employee) => {
    setCurrentEmployee(employee);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = (employeeId) => {
    useEffect(() => {
      const removeEmployee = async () => {
        // 직원 삭제 요청
        try {
          deleteEmployee(employeeId);
          console.log("직원 삭제가 완료되었습니다.");
        } catch (error) {
          console.log(error);
        }
      }
      removeEmployee();
  }, [])};

  return (
    <div>
      <h2>직원 관리</h2>
        { employees ? (
          employees.map((employee) => (
          <Card key={employee.id} onClick={() => handleOpen(employee)} style={{ cursor: 'pointer', marginBottom: '10px' }}>
            {employee.name}
          </Card>
        ))
      ) : (
      <h4>직원이 없습니다.</h4>
      )}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>직원 상세 정보</DialogTitle>
          <DialogContent>
            {currentEmployee && (
              <>
                <p>이름 : {currentEmployee.name}</p>
                <p>등록일 : {currentEmployee.createDate}</p>              
              </>
            )}
          </DialogContent>
          <DialogActions style={{ justifyContent: 'space-between' }}>
            <button onClick={() => handleDelete(currentEmployee.id)}>삭제</button>
            <button className={classes.modalCloseButton} onClick={handleClose} color="primary">
              X
            </button>
          </DialogActions>
        </Dialog>
    </div>
  );
};

