import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

const SectionTitleWrap = (props) => {

    const {title, value, children, ...other} = props;

    return (
        <>
            <Box component={"div"} sx={{my: 2}} {...other}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="subtitle2">{title}</Typography>
                    {
                        (value !== undefined) ?
                            <Typography variant="subtitle2"
                                        sx={{color: 'secondary.main'}}>
                                {value}</Typography> : null
                    }
                </Stack>


                {children}
            </Box>
            <Divider/>
        </>
    )
}

export default SectionTitleWrap;