import { makeStyles } from "@material-ui/core";
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/infoStyle.js";

const useStyles = makeStyles(styles)

// 회원정보랜더링
export default function Info({name, email, businessNumber}) {
    
    const classes = useStyles();

    return (
        <div>
            <h2>기본 정보</h2>
            <div className={classes.container}>
                <h4><strong>이메일: {email}</strong></h4>
                <h4><strong>사업자 명: {name}</strong></h4>
                <h4><strong>사업자 번호: {businessNumber}</strong></h4>
                {/* <h4><strong>구독시작일: {userInfo.startDate}</strong></h4> */}
            </div>
        </div>
    )
}