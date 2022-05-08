import Button from "@mui/material/Button";

const SubmitButton = ({text, disabled, ...other}) => {
    return <Button type="submit"
                   variant="contained"
                   disableElevation
                   disabled={disabled}
                   sx={{mt: 2, color: 'common.white'}}
                   {...other}
    >
        {text || 'Run'}
    </Button>
}

export default SubmitButton;