import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Input, Card, InputAdornment } from '@material-ui/core';
import { deleteBusinessEmployee, addEmployeeToBusiness, fetchEmployeeByEmail, fetchBusinessEmployees } from '../../pages/api';
import { makeStyles } from '@material-ui/core';
import style from '/styles/jss/nextjs-material-kit/pages/componentsSections/manageEmployeesStyle.js';
import { useRouter } from 'next/router';
import Image from 'next/image';

const useStyles = makeStyles(style);

export default function ManageEmployees({ businessId }) {
    const classes = useStyles();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [employees, setEmployees] = useState(null);
    const [searchResults, setSearchResults] = useState(null);
    const [searchEmail, setSearchEmail] = useState('');

    useEffect(() => {
        fetchEmployees();
        console.log(employees);
    }, [searchResults]);

    // 현재 직원 목록 
    const fetchEmployees = async () => {
        try {
            const response = await fetchBusinessEmployees(businessId); 
            const result = response.data.result;

            const filteredEmployees = result.filter(employee => employee.roleTypeEnum === 'EMPLOYEE');
            setEmployees(filteredEmployees)

        } catch (error) {
            console.error("Error fetching employees:", error);
            router.push('/404')
        }
    };

    const handleSearch = async () => {
        try {
            const response = await fetchEmployeeByEmail(searchEmail);
            const result = response.data.result;

            if ( result && result.businessId !== businessId ) {
                setSearchResults(result);
            } else {
                setSearchResults(null);
            }

        } catch (error) {
            console.error("Error searching employees:", error);
            setSearchResults(null);
        }
    };

    const handleAddEmployee = async (employeeId) => {
        try {
            await addEmployeeToBusiness(businessId, employeeId);
            setSearchResults(null);
            setSearchEmail('');
            alert('직원이 추가되었습니다.');
            fetchEmployees();
        } catch (error) {
            router.push('/404');
        }
    };

    const handleDelete = async (employeeId, event) => {
    event.stopPropagation();
    try {
        await deleteBusinessEmployee(employeeId, businessId);
        fetchEmployees(); 
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
                        <Button onClick={() => handleAddEmployee(searchResults.id)} className={classes.button}>
                            추가
                        </Button>
                    </card>
                ) : (
                    <div>검색 결과가 없습니다.</div>
                )}
            </div>
            {/* 현재 직원 목록 */}
            <h4 className={classes.listTitle}>직원 목록</h4>
            <div className={classes.listContainer}>
                {employees ? (
                    employees.map((employee) => (
                        <Card key={employee.id} className={classes.listCard}>
                            <div className={classes.nameDiv} onClick={() => handleOpen(employee)}>{employee.name}</div>
                            <Button onClick={(e) => handleDelete(employee.id, e)} className={classes.button}>
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
                <div className={classes.modalTitle}><DialogTitle>직원 상세 정보</DialogTitle></div>
                <DialogContent>
                    {currentEmployee && (
                        <>
                            <p>이름: {currentEmployee.name}</p>
                            <p>이메일: {currentEmployee.email}</p>
                            <p>등록일: {currentEmployee.businessAddDate}</p>
                        </>
                    )}
                </DialogContent>
                <DialogActions style={{ justifyContent: 'flex-end' }}>
                    <Button className={classes.modalCloseButton} onClick={handleClose} color="primary">
                        X
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

