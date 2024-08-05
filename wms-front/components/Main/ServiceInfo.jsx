import { makeStyles } from "@material-ui/core"
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/serviceInfoStyle.js"

const useStyles = makeStyles(styles)

export default function ServiceInfo() {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <div className={classes.section1}>
                <h2 className={classes.title}>재고관리의 시작, FitBox 에서</h2>
                <span className={classes.subTitle}>FitBox는 복잡했던 재고관리에 혁신을 제공합니다.</span>
            </div>
            <div className={classes.section2}>
                <img className={classes.subImg} src="/img/sub1.jpg" alt="sub1"/>
            </div>
        </div>
    )
};