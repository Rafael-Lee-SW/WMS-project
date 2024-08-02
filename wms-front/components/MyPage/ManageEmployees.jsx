import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { deleteEmployee } from '../../pages/api';
import { Card } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import style from '/styles/jss/nextjs-material-kit/effect/modalStyle.js'
import { useRouter } from 'next/router';

const useStyles = makeStyles(style)

// 직원 관리 Component
export default function ManageEmployees({employees, onUpdateEmployees}) {
  const classes = useStyles();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  
  const handleOpen = (employee) => {
    setCurrentEmployee(employee);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async (employeeId) => {
      try {
        deleteEmployee(employeeId);
        onUpdateEmployees();
      } catch (error) {
        router.push('/404');
      }
    };
      
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

