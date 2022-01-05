import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

const Selector = ({ title, value, onChange, items, sx }) => {

    return (
        <FormControl variant="standard" sx={sx}>
            <InputLabel id={`${title}-selector`}>{title}</InputLabel>
            <Select
                labelId={`${title}-selector-label`}
                id={`${title}-selector-id`}
                value={value}
                onChange={onChange}
                label={title}
            >
                {Object.entries(items).map(([k, v]) => {
                    return (
                        <MenuItem value={k} key={k}>{v}</MenuItem>
                    )
                })}
            </Select>
        </FormControl>
    )
}

export default Selector;

