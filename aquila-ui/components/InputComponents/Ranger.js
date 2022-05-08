import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import HelperTips from "./HelperTips";
import {forwardRef} from "react";

// const Ranger = ({value, step, min, max, title, onChange, description}) => {
//     return <Stack direction="column">
//         <Stack direction="row" alignItems="center" spacing={1}>
//             <Typography gutterBottom variant="subtitle2">
//                 {title}
//             </Typography>
//             {description ? <HelperTips text={description} style={{marginBottom: "0.35rem"}}/> : null}
//         </Stack>
//         <Slider
//             defaultValue={min}
//             value={value}
//             valueLabelDisplay="auto"
//             step={step}
//             marks={[{value: min, label: min}, {value: max, label: max}]}
//             min={min}
//             max={max}
//             onChange={onChange}
//             sx={{maxWidth: '200px'}}
//         />
//
//     </Stack>
// }


const Ranger = forwardRef(function Ranger(
    props,
    ref) {
    const {step, min, max, title, description, children, ...other} = props;
    return <Stack direction="column">
        <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle2">
                {title}
            </Typography>
            {description ? <HelperTips text={description} sx={{ml: 2}}/> : null}
        </Stack>
        <Slider
            ref={ref}
            valueLabelDisplay="auto"
            step={step}
            marks={[{value: min, label: min}, {value: max, label: max}]}
            min={min}
            max={max}
            // sx={{maxWidth: '200px'}}
            {...other}
        />
    </Stack>
})

export default Ranger;