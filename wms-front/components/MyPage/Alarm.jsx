import { useEffect, useState } from "react"

// 알람 목록 가져오기
export default function Alarm() {
    const [alarms, setAlarms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    // 데이터 fetch 함수 정의
    const fetchData = async () => {
      try {
        const response = await fetch('');
        if (!response.ok) {
          throw new Error('응답이 올바르지 않습니다.');
        }
        const data = await response.json();
        setItems(data);
      } catch (error) {
        setError(error);
        return error;
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

    return (
        <div>
            <h2>알람 목록</h2>
            <ul>
                {alarms.map((alarm) => (
                    <li key={alarm.id}>{alarm.content}</li>
                ))}
            </ul>
        </div>
    )
}