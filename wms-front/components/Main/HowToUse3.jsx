import { makeStyles } from "@material-ui/core"
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/howToUseStyle.js"

const useStyles = makeStyles(styles)

export default function HowToUse3() {
    const classes = useStyles();

    return (
        <div className={classes.container} style={{ backgroundColor: "#ADAAA5" }}>
            <div className={classes.section1}>
                <h4>이동, 벽 생성 영상</h4>
            </div>
            <div className={classes.section2}>
                <h2 className={classes.title} style={{ color: "black" }}>벽을 생성합니다.</h2> 
                <p style={{ color: "black" }} className={classes.section2Content}>이동은 물론, 벽과 특수객체까지 추가할 수 있어요.</p>
            </div>
        </div>
    )
}