import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import HelperTips from "./HelperTips";

const Ranger = ({value, step, min, max, title, onChange, description}) => {
    return <Stack direction="column">
        <Stack direction="row" alignItems="center" spacing={1}>
            <Typography gutterBottom variant="subtitle2">
                {title}
            </Typography>
            {description ? <HelperTips text={description} style={{marginBottom: "0.35rem"}}/> : null}
        </Stack>
        <Slider
            defaultValue={min}
            value={value}
            valueLabelDisplay="auto"
            step={step}
            marks={[{value: min, label: min}, {value: max, label: max}]}
            min={min}
            max={max}
            onChange={onChange}
            sx={{maxWidth: '200px'}}
        />

    </Stack>
}

export default Ranger;