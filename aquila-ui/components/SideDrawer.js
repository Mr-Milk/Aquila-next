import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/icons-material/Menu";
import MuiNextLink from "./Link";
import {useState} from "react";

const SideDrawer = ({ navLinks }) => {
    const [state, setState] = useState({
        right: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <Box
            sx={{ width: 250, marginTop: `auto`, marginBottom: `auto` }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            {navLinks.map(({ title, path }, i) => (
                <Typography
                    variannt="button"
                    key={`${title}${i}`}
                    sx={{
                        ml: 5,
                        my: 2,
                        textTransform: `uppercase`,
                    }}
                >
                    <MuiNextLink sx={{ color: "common.white" }} href={path}>
                        {title}
                    </MuiNextLink>
                </Typography>
            ))}
        </Box>
    );

    return (
        <>
            <IconButton
                edge="start"
                aria-label="menu"
                onClick={toggleDrawer("right", true)}
                sx={{
                    color: `primary.main`,
                    display: { xs: `inline`, md: `none` },
                }}
            >
                <Menu fontSize="large" />
            </IconButton>
            <Drawer
                elevation={0}
                anchor="right"
                open={state.right}
                onClose={toggleDrawer("right", false)}
                sx={{
                    ".MuiDrawer-paper": {
                        bgcolor: "rgba(255, 152, 0, 0.6)",
                        backdropFilter: "blur(8px)",
                    },
                }}
            >
                {list("right")}
            </Drawer>
        </>
    );
};

export default SideDrawer;
