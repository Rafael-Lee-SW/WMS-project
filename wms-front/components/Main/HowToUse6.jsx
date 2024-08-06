import { makeStyles } from "@material-ui/core"
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/howToUseStyle.js"

const useStyles = makeStyles(styles)

export default function HowToUse6() {
    const classes = useStyles();

    return (
        <div className={classes.container} style={{ backgroundColor: "#C2B6A1" }}>
            <div className={classes.section1}>
                <h4>직원추가</h4>
            </div>
            <div className={classes.section2}>
                <h2 className={classes.title} style={{ color: "#4A412F" }}>직원을 추가합니다.</h2> 
                <p style={{ color: "#4A412F" }} className={classes.section2Content}>절차에 따라 직원을 추가하고 삭제할 수 있습니다.</p>
            </div>
        </div>
    )
}