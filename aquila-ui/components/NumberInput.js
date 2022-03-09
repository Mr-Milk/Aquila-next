import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import HelperTips from "./HelperTips";


export const isPosInt = (num) => {
    const parsed = parseInt(num);
    if (isNaN(parsed)) {
        return false;
    } else if (parsed <= 0) {
        return false
    }
    return true;
}

export const isPosFloat = (num) => {
    const parsed = parseFloat(num);
    if (isNaN(parsed)) {
        return false;
    } else if (parsed <= 0) {
        return false
    }
    return true;
}


export const inRangeInt = (num, lower, upper, edge) => {
    edge = edge || true;
    const parsed = parseInt(num);
    const inRange = edge ? ((parsed >= lower) && (parsed <= upper)) : ((parsed > lower) && (parsed < upper))
    if (isNaN(parsed)) {
        return false;
    } else return inRange;
}

export const inRangeFloat = (num, lower, upper, edge) => {
    edge = edge || true;
    const parsed = parseFloat(num);
    const inRange = edge ? ((parsed >= lower) && (parsed <= upper)) : ((parsed > lower) && (parsed < upper))
    if (isNaN(parsed)) {
        return false;
    } else return inRange;
}


const BaseInput = ({label, error, onChange, helperText, defaultValue, useNumber, ...other}) => {
    return <TextField
        label={label}
        variant="standard"
        type={useNumber ? "number" : "text"}
        inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
        error={error}
        helperText={error && helperText}
        onChange={onChange}
        defaultValue={defaultValue}
        {...other}
    />
}


const NumberInput = ({label, error, onChange, helperText, description, defaultValue, useNumber, ...other}) => {

    useNumber = useNumber || true

    if (description !== undefined) {
        return (
            <Stack direction="row" alignItems="center" spacing={1}>
                    <BaseInput
                        label={label}
                        error={error}
                        helperText={error && helperText}
                        onChange={onChange}
                        defaultValue={defaultValue}
                        {...other}
                    />
                    <HelperTips text={description} style={{ marginTop: "0.5rem" }}/>
            </Stack>
        )
    } else {
        return <BaseInput
            label={label}
            error={error}
            helperText={error && helperText}
            onChange={onChange}
            defaultValue={defaultValue}
            {...other}
        />
    }


}

export default NumberInput;