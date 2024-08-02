const editInfoStyle = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        height: '100vh',
        textAlign: 'center',
        padding: "10px",
        paddingTop: '50px',
        position: 'relative'
    },
    h3: {
        position: 'absolute',
        top: '10px',
        left: '10px',
        margin: '0'
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
        backgroundColor: "lightgray",
        height: "30px"
    }
}

export default editInfoStyle;
