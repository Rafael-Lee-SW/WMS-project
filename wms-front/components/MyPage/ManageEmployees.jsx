import { useEffect } from 'react';
import { deleteEmployee } from '../../pages/api';

// 직원관리
export default function ManageEmployees({employees}) {

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
      <ul>
        {employees.map((employee) => (
          <p key={employee.id}>
            {employee.name} - {employee.created_date}
            <button onClick={() => handleDelete(employee.id)}>삭제</button>
          </p>
        ))}
      </ul>
    </div>
  );
};

