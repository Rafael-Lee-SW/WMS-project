// import { useState, useEffect } from 'react';
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Input, Card } from '@material-ui/core';
// import { deleteEmployee, addEmployeeToBusiness, searchEmployeesByEmail, fetchBusinessEmployees } from '../../pages/api';
// import { makeStyles } from '@material-ui/core';
// import style from '/styles/jss/nextjs-material-kit/pages/componentsSections/ManageEmployeesStyle.js';
// import { useRouter } from 'next/router';

// import { useState } from "react"

// const useStyles = makeStyles(style);

// export default function ManageEmployees({ businessId, onUpdateEmployees }) {
//     const classes = useStyles();
//     const router = useRouter();
//     const [open, setOpen] = useState(false);
//     const [currentEmployee, setCurrentEmployee] = useState(null);
//     const [employees, setEmployees] = useState([]);
//     const [searchResults, setSearchResults] = useState([]);
//     const [searchEmail, setSearchEmail] = useState('');

//     useEffect(() => {
//         // 직원 목록을 불러오는 함수를 여기에 작성할 수 있습니다.
//         fetchEmployees();
//     }, []);

//     const fetchEmployees = async () => {
//         try {
//             const result = await fetchBusinessEmployees(businessId); 
//             setEmployees(result);
//         } catch (error) {
//             console.error("Error fetching employees:", error);
//             router.push('/404')
//         }
//     };

//     const handleSearch = async () => {
//         try {
//             const results = await searchEmployeesByEmail(searchEmail);
//             setSearchResults(results);
//         } catch (error) {
//             console.error("Error searching employees:", error);
//         }
//     };

//     const handleAddEmployee = async (employeeId) => {
//         try {
//             await addEmployeeToBusiness(businessId, employeeId);
//             onUpdateEmployees();
//             setSearchResults([]);
//             fetchEmployees(); // 직원 추가 후 목록 갱신
//         } catch (error) {
//             router.push('/404');
//         }
//     };

//     const handleDelete = async (employeeId) => {
//         try {
//             await deleteEmployee(employeeId);
//             onUpdateEmployees();
//             fetchEmployees(); // 직원 삭제 후 목록 갱신
//         } catch (error) {
//             router.push('/404');
//         }
//     };

//     const handleOpen = (employee) => {
//         setCurrentEmployee(employee);
//         setOpen(true);
//     };

//     const handleClose = () => {
//         setOpen(false);
//     };

//     return (
//         <div>
//             <h3>직원 관리</h3>

//             {/* 검색 폼 */}
//             <div className={classes.searchContainer}>
//                 <Input
//                     type="email"
//                     placeholder="직원 이메일 검색"
//                     value={searchEmail}
//                     onChange={(e) => setSearchEmail(e.target.value)}
//                     className={classes.input}
//                 />
//                 <Button onClick={handleSearch} className={classes.searchButton}>
//                     검색
//                 </Button>
//             </div>

//             {/* 검색 결과 목록 */}
//             <div>
//                 {searchResults.length > 0 && searchResults.map((employee) => (
//                     <Card key={employee.id} className={classes.card}>
//                         <div>{employee.email}</div>
//                         <Button onClick={() => handleAddEmployee(employee.id)} className={classes.addButton}>
//                             추가
//                         </Button>
//                     </Card>
//                 ))}
//             </div>

//             {/* 현재 직원 목록 */}
//             <div>
//                 {employees.length > 0 ? (
//                     employees.map((employee) => (
//                         <Card key={employee.id} onClick={() => handleOpen(employee)} className={classes.card}>
//                             {employee.name}
//                             <Button onClick={() => handleDelete(employee.id)} className={classes.deleteButton}>
//                                 삭제
//                             </Button>
//                         </Card>
//                     ))
//                 ) : (
//                     <h4>직원이 없습니다.</h4>
//                 )}
//             </div>

//             {/* 직원 상세 정보 모달 */}
//             <Dialog open={open} onClose={handleClose}>
//                 <DialogTitle>직원 상세 정보</DialogTitle>
//                 <DialogContent>
//                     {currentEmployee && (
//                         <>
//                             <p>이름: {currentEmployee.name}</p>
//                             <p>등록일: {currentEmployee.createDate}</p>
//                         </>
//                     )}
//                 </DialogContent>
//                 <DialogActions style={{ justifyContent: 'space-between' }}>
//                     <Button onClick={() => handleDelete(currentEmployee.id)}>삭제</Button>
//                     <Button className={classes.modalCloseButton} onClick={handleClose} color="primary">
//                         X
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </div>
//     );
// }


export default function ManageEmployees () {
  return (
    <div>수정중</div>
  )
};
