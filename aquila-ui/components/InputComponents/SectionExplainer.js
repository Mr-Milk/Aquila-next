import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useState} from "react";
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const SectionExplainer = (props) => {

    const {title, details, vizTips, ...other} = props;
    const [open, setOpen] = useState(false);

    return (
        <>
            <Box component={"div"} sx={{my: 2}} {...other}>
                <Stack direction="row" alignItems="center" spacing={1} onClick={() => setOpen(!open)}>
                    <Typography variant="subtitle2" sx={{whiteSpace: 'nowrap'}}>{title}</Typography>
                    <ExpandMoreIcon color="action" sx={{
                        transform: open ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.1s',
                    }}/>
                </Stack>
                {
                    open ?
                        <>
                            <Typography variant="body2" sx={{maxWidth: '350px'}}>{details}</Typography>
                            {
                                vizTips !== undefined ? <Alert icon={<BubbleChartIcon fontSize="inherit"/>}
                                sx={{ mt: 1, }}>
                                    <AlertTitle>Visualization Tips</AlertTitle>
                                    {vizTips}
                                </Alert> : null
                            }
                        </>

                        : null
                }
            </Box>
            <Divider/>
        </>
    )
}

export default SectionExplainer;