// 알람 목록 랜더링
export default function Alarm({notifications}) {
    return (
        <div>
            <h2>알람 목록</h2>
            <ul>
                {notifications.map((notification) => (
                    <li key={notification.id}>{notification.content}</li>
                ))}
            </ul>
        </div>
    )
}