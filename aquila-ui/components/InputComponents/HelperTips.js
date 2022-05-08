import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

const HelperTips = (props) => {

    const {text, ...other} = props;

    return <Tooltip title={
        <Typography variant="subtitle2">{text}</Typography>
    }>
        <HelpOutlineIcon fontSize="small" color="secondary" {...props}/>
    </Tooltip>
}

export default HelperTips;