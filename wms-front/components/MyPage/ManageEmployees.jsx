import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 직원관리
const ManageEmployees = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState(['이한솔']);

// API 호출하여 직원 목록 가져오기
//   useEffect(() => {
//     axios.get('/api/employees')
//       .then(response => {
//         setEmployees(response.data);
//         setLoading(false);
//       })
//       .catch(error => {
//         setError(error);
//         setLoading(false);
//       });
//   }, []);

  const handleDelete = (employeeId) => {
    // 직원 삭제 로직 추가
    axios.delete(`/api/delete-employee/${employeeId}`)
      .then(response => {
        // 성공 처리
        setEmployees(employees.filter(employee => employee.id !== employeeId));
        console.log('직원이 성공적으로 삭제되었습니다.');
      })
      .catch(error => {
        // 오류 처리
        console.error('직원 삭제에 실패했습니다.', error);
      });
  };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>직원 관리</h2>
      <ul>
        {employees.map((employee) => (
          <p key={employee.id}>
            {employee.id} {employee.created_date}
            <button onClick={() => handleDelete(employee.id)}>삭제</button>
          </p>
        ))}
      </ul>
    </div>
  );
};

export default ManageEmployees;
