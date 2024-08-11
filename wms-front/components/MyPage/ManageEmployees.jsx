import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Input, Card, InputAdornment } from '@material-ui/core';
import { deleteEmployee, addEmployeeToBusiness, fetchEmployeeByEmail, fetchBusinessEmployees } from '../../pages/api';
import { makeStyles } from '@material-ui/core';
import style from '/styles/jss/nextjs-material-kit/pages/componentsSections/manageEmployeesStyle.js';
import { useRouter } from 'next/router';
import Image from 'next/image';

const useStyles = makeStyles(style);

export default function ManageEmployees({ businessId, onUpdateEmployees }) {
    const classes = useStyles();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [searchResults, setSearchResults] = useState(null);
    const [searchEmail, setSearchEmail] = useState('');

    useEffect(() => {
        console.log(searchResults);
    }, [searchResults]);

    // // 현재 직원 목록 
    // const fetchEmployees = async () => {
    //     try {
    //         const response = await fetchBusinessEmployees(businessId); 
    //         setEmployees(response.data.result);
    //     } catch (error) {
    //         console.error("Error fetching employees:", error);
    //         router.push('/404')
    //     }
    // };

    const handleSearch = async () => {
        try {
            const response = await fetchEmployeeByEmail(searchEmail);
            const result = response.data.result;

            // 단일 객체로 설정
            setSearchResults(result || null);
        } catch (error) {
            console.error("Error searching employees:", error);
            setSearchResults(null);
        }
    };

    const handleAddEmployee = async (employeeId) => {
        try {
            await addEmployeeToBusiness(businessId, employeeId);
            // onUpdateEmployees();
            setSearchResults([]);
            // fetchEmployees(); // 직원 추가 후 목록 갱신
        } catch (error) {
            router.push('/404');
        }
    };

    const handleDelete = async (employeeId) => {
        try {
            await deleteEmployee(employeeId);
            // onUpdateEmployees();
            // fetchEmployees(); // 직원 삭제 후 목록 갱신
        } catch (error) {
            router.push('/404');
        }
    };

    const handleOpen = (employee) => {
        setCurrentEmployee(employee);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.container}>
            <h3>직원 관리</h3>

            {/* 검색 폼 */}
            <div className={classes.searchContainer}>
                
                <Input
                    type="email"
                    placeholder="직원 이메일 검색"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    className={classes.input}
                    startAdornment={
                        <InputAdornment position="start">
                            <Image src="/img/mailIconBk.png" alt="Mail Icon" width={20} height={20} />
                        </InputAdornment>
                    }
                />
                <Button onClick={handleSearch} className={classes.searchButton}>
                    검색
                </Button>
            </div>

            {/* 검색 결과 목록 */}
            <div className={classes.resultContainer}>
                {searchResults ? (
                    <card className={classes.card}>
                        <div>{searchResults.email}</div>
                        <Button onClick={() => handleAddEmployee(searchResults.id)} className={classes.addButton}>
                            추가
                        </Button>
                    </card>
                ) : (
                    <div>검색 결과가 없습니다.</div>
                )}
            </div>
            {/* 현재 직원 목록 */}
            <div>
                {employees.length > 0 ? (
                    employees.map((employee) => (
                        <Card key={employee.id} onClick={() => handleOpen(employee)} className={classes.card}>
                            {employee.name}
                            <Button onClick={() => handleDelete(employee.id)} className={classes.deleteButton}>
                                삭제
                            </Button>
                        </Card>
                    ))
                ) : (
                  <div></div>
                )

                }
            </div>

            {/* 직원 상세 정보 모달 */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>직원 상세 정보</DialogTitle>
                <DialogContent>
                    {currentEmployee && (
                        <>
                            <p>이름: {currentEmployee.name}</p>
                            <p>등록일: {currentEmployee.createDate}</p>
                        </>
                    )}
                </DialogContent>
                <DialogActions style={{ justifyContent: 'space-between' }}>
                    <Button onClick={() => handleDelete(currentEmployee.id)}>삭제</Button>
                    <Button className={classes.modalCloseButton} onClick={handleClose} color="primary">
                        X
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

