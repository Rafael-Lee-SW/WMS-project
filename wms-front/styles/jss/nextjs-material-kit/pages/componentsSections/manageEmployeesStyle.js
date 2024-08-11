const manageEmployeesStyle = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center', 
    },
    searchContainer: {
        marginTop: '30px',
    },
    resultContainer: {
        paddingTop: '30px',
        width: '100%',
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center',     
        padding: '10px',
    },
    div: {
        padding: "10px"
    },
    button: {
        margin: "10px",
        backgroundColor: "lightgray",
        height: "30px"
    },
    card: {
        width: '40%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        marginBottom: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    email: {
        flexGrow: 1, 
    },
    searchButton: {
        padding: 0,
        paddingBottom: '6px'
    },
    addButton: {        
        backgroundColor: "#7D4A1A",
        width: '100px',
        color: 'white',
        height: "30px",
        '&:hover': {
            transform: 'scale(1.05)',
            backgroundColor: '#7D4A1A',
            color: 'white',
        },
    },
}
export default manageEmployeesStyle;