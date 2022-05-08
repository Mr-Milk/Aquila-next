import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import {forwardRef} from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import HelperTips from "./HelperTips";

const Selector = forwardRef(function Selector(
    props,
    ref) {
    const {title, options, description, ...other} = props;
    return (
        <Stack direction="column">
            <Stack direction="row">
                <Typography variant="subtitle2">{title}</Typography>
                {description ? <HelperTips text={description} sx={{ml: 1}}/> : null}
            </Stack>
            <Select ref={ref} variant="standard" {...other}>
                {options.map((option, i) => {
                    return (
                        <MenuItem value={option.value} key={i}>{option.label}</MenuItem>
                    )
                })}
            </Select>
        </Stack>
    )
})


export default Selector;

