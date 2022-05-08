import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";

const ParamWrap = ({show = true, children}) => {
    const display = show ? 'block' : 'none';

    return (
        <>
            <Box component={"div"} sx={{py: 2}} style={{display}}>
                {children}
            </Box>
            <Divider style={{display}}/>
        </>
    )
}

export default ParamWrap;