import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import HelperTips from "./HelperTips";
import {forwardRef, useState} from "react";
import Typography from "@mui/material/Typography";


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


const NumericField = forwardRef(function NumericField(
    props,
    ref) {
    const {title, error = false, placeholder, helperText, description, ...other} = props;

    return <Stack>
        <Stack direction="row" alignItems="center">
            <Typography variant="subtitle2">{title}</Typography>
            {description ? <HelperTips text={description} sx={{ml: 1}}/> : null}
        </Stack>
        <TextField error={error}
                   variant="standard"
                   placeholder={placeholder}
                   type="number"
                   inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
                   helperText={error ? helperText : ""}
                   ref={ref}
                   {...other} />
    </Stack>
})

export default NumericField;