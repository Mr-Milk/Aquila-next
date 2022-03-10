import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

const HelperTips = ({text, style}) => {
    return <Tooltip title={
        <Typography variant="subtitle2">{text}</Typography>
    }>
        <HelpOutlineIcon color="secondary" style={style} sx={{fontSize: 16}}/>
    </Tooltip>
}

export default HelperTips;