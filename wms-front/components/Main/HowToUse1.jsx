import { makeStyles } from "@material-ui/core"
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/howToUseStyle.js"

const useStyles = makeStyles(styles)

export default function HowToUse1() {
    const classes = useStyles();

    return (
        <div className={classes.container} style={{ backgroundColor: "#E2DFD7" }}>
            <div className={classes.section1}>
                <h4>창고 생성 영상</h4>
            </div>
            <div className={classes.section2}>
                <h2 className={classes.title} style={{ color: "#4E4544" }}>창고를 생성합니다.</h2> 
                <p style={{ color: "#4E4544" }} className={classes.section2Content}>구매한 창고 개수만큼 생성할 수 있어요.</p>
            </div>
        </div>
    )
}