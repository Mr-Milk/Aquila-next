import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import GitHub from "@mui/icons-material/GitHub";
import Email from "@mui/icons-material/Email";
import Science from "@mui/icons-material/Science";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import {Tooltip} from "@mui/material";


const Footer = () => {

    const IconButtonStyle = {
        borderRadius: "50%",
        color: "white",
    }

    return <Box component="footer" sx={{
        py: 3,
        textAlign: "center",
        borderTopStyle: "solid",
        borderTopWidth: "1px",
        backdropFilter: "blur(8px)",
        borderTopColor: "#d3d3d3"
    }}>
        <Stack
            direction="row"
            justifyContent="center"
            spacing={2}
            sx={{my: 2}}
        >
            <Tooltip title="Github">
                <IconButton href="https://github.com/Mr-Milk/Aquila-next"
                            sx={{
                                bgcolor: "#0C0C0C",
                                '&:hover': {bgcolor: "#434343"},
                                ...IconButtonStyle
                            }}>
                    <GitHub/>
                </IconButton>
            </Tooltip>

            <Tooltip title="Email us">
                <IconButton href="mailto:echeung@um.edu.mo"
                            sx={{
                                bgcolor: "#0D5661",
                                '&:hover': {bgcolor: "#0089A7"},
                                ...IconButtonStyle
                            }}
                >
                    <Email/>
                </IconButton>
            </Tooltip>

            <Tooltip title="Lab page">
                <IconButton href="https://cheunglab.org"
                            sx={{
                                bgcolor: "#CC543A",
                                '&:hover': {bgcolor: "#ED784A"},
                                ...IconButtonStyle
                            }}>
                    <Science/>
                </IconButton>
            </Tooltip>
        </Stack>

        <Grid container direction="row" alignItems="center" justifyContent="center" spacing={2}>
            <Grid item>
                <Typography align="right" color={"black"} fontFamily={"Outfit"}>
                    ©{new Date().getFullYear()} Cheung Lab, University of Macau
                </Typography>
            </Grid>
            <Grid item>
                <Avatar src="https://www.um.edu.mo/wp-content/uploads/2020/09/cropped-512-192x192.png"/>
            </Grid>
        </Grid>
    </Box>;
};

export default Footer;