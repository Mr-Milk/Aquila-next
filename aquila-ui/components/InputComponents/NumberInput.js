import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import HelperTips from "./HelperTips";
import {forwardRef} from "react";
import Typography from "@mui/material/Typography";


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
            //inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
                   helperText={error ? helperText : ""}
                   ref={ref}
                   {...other} />
    </Stack>
})

export default NumericField;