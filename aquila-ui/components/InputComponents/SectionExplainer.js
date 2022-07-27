import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useState} from "react";
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const SectionExplainer = ({title, details, vizTips, sx, ...other}) => {

    const [open, setOpen] = useState(false);

    return (
        <>
            <Box component={"div"} sx={{my: 2, ...sx}} {...other}>
                <Stack direction="row" alignItems="center" spacing={1} onClick={() => setOpen(!open)}>
                    <Typography variant="subtitle2" sx={{whiteSpace: 'nowrap'}}>{title}</Typography>
                    <ExpandMoreIcon color="action" sx={{
                        transform: open ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.1s',
                        "&:hover": {
                            color: 'primary.main',
                            cursor: 'pointer',
                        }
                    }}/>
                </Stack>
                {
                    open ?
                        <>
                            <Typography variant="body2" sx={{ maxWidth: "450px" }}>{details}</Typography>
                            {
                                vizTips !== undefined ? <Alert icon={<BubbleChartIcon fontSize="inherit"/>}
                                                               sx={{mt: 1,}}>
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