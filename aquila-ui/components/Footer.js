import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import GitHub from "@mui/icons-material/GitHub";
import Email from "@mui/icons-material/Email";
import Science from "@mui/icons-material/Science";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";


const Footer = () => {

    const IconButtonStyle = {
        bgcolor: "primary.main",
        borderRadius: "50%",
        color: "white",
        '&:hover': {
            bgcolor: "primary.light"
        }
    }

    return <Box component="footer" sx={{
        py: 3,
        textAlign: "center",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderTopStyle: "solid",
        borderTopWidth: "1px",
        backdropFilter: "blur(8px)",
        borderTopColor: "#d3d3d3"
    }}>
        <Stack
            direction="row"
            justifyContent="center"
            spacing={2}
            sx={{mb: 3}}
        >
            <IconButton sx={IconButtonStyle}>
                <GitHub/>
            </IconButton>
            <IconButton sx={IconButtonStyle}>
                <Email/>
            </IconButton>
            <IconButton sx={IconButtonStyle}>
                <Science/>
            </IconButton>
        </Stack>

        <Grid container direction="row" alignItems="center" justifyContent="center" spacing={2}>
            <Grid item>
                <Typography align="right" color={"black"}>
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