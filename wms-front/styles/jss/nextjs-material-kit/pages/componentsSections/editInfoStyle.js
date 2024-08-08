import { colors } from "@material-ui/core";

const editInfoStyle = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
        padding: "10px",
        paddingRight: '140px',
        paddingTop: '50px',
        position: 'relative'
    },
    h3: {
        margin: '0',
    },
    form: {
        padding: '40px',
        display: 'grid',
        gridTemplateColumns: 'auto 2fr',
        gap: '10px',
        alignItems: 'center',
        width: '80%',
        maxWidth: '600px'
    },
    label: {
        textAlign: 'right',
        paddingRight: '10px'
    },
    input: {
        width: '100%'
    },
    buttonContainer: {
        gridColumn: 'span 2',  
        display: 'flex',
        justifyContent: 'flex-end'
    },
    button: {
        marginTop: '20px',
        width: '20%',
        backgroundColor: "#7D4A1A",
        color: 'white',
        height: "30px",
        '&:hover': {
        transform: 'scale(1.05)',
        backgroundColor: '#7D4A1A',
        color: 'white',
    },
    }
}

export default editInfoStyle;
