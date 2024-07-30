import axios from 'axios';

// 직원관리
export default function ManageEmployees({employees}) {

  const handleDelete = (employeeId) => {
    // 직원 삭제 로직 추가
    axios.delete(`/api/delete-employee/${employeeId}`)
      .then(() => {
        console.log('직원이 성공적으로 삭제되었습니다.');
        // 필요 시, 직원 목록 갱신 로직 추가
      })
      .catch((error) => {
        // 오류 처리
        console.error('직원 삭제에 실패했습니다.', error);
      });
  };
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

