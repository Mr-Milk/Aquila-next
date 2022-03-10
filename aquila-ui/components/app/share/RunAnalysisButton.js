import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";


const RunButton = ({onClick, onTipOpen, onTipClose}) => {

    return (
        <>
            <Button
                variant="contained"
                disableElevation
                sx={{color: "common.white"}}
                onClick={onClick}
            >
                Run
            </Button>
            <Snackbar
                open={onTipOpen}
                autoHideDuration={6000}
                message="Invalid Input Parameter"
                security="error"
                onClose={onTipClose}
            >
                <Alert onClose={onTipClose} severity="error" sx={{width: '100%'}}>
                    Invalid input parameter
                </Alert>
            </Snackbar>
        </>
    )
}

export default RunButton;