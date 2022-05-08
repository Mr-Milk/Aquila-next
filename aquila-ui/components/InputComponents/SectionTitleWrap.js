import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

const SectionTitleWrap = (props) => {

    const {title, children, ...other} = props;

    return (
        <>
            <Box component={"div"} sx={{my: 2}} {...other}>
                <Typography variant="subtitle2">{title}</Typography>
                {children}
            </Box>
            <Divider/>
        </>
    )
}

export default SectionTitleWrap;