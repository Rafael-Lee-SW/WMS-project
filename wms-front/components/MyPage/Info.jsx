import { makeStyles } from "@material-ui/core";
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/infoStyle.js";

const useStyles = makeStyles(styles)

// 회원정보 랜더링
export default function Info({ name, email, nickname, statusEnum, businessNumber }) {
    
    const classes = useStyles();
    const initialUserInfo = statusEnum !== 'DELETED' ? { name, email, nickname, businessNumber } : { name: '', email: '', nickname: '', businessNumber: '' };

    return (
      <div>
        <h3>{name}님, 반갑습니다.</h3>
        {statusEnum === 'DELETED' ? (
          <h4><strong>이메일: {initialUserInfo.email}</strong></h4>
        ) : (
          <div className={classes.container}>
            <table className={classes.table}>
              <tbody>
                <tr>
                  <td className={classes.labelCell}><strong className={classes.text}>사업자 명</strong></td>
                  <td className={classes.valueCell}>{initialUserInfo.name}</td>
                </tr>
                <tr>
                  <td className={classes.labelCell}><strong className={classes.text}>이메일</strong></td>
                  <td className={classes.valueCell}>{initialUserInfo.email}</td>
                </tr>
                <tr>
                  <td className={classes.labelCell}><strong className={classes.text}>사업자 번호</strong></td>
                  <td className={classes.valueCell}>{initialUserInfo.businessNumber}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    )
}
