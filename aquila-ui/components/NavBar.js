import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import MuiNextLink from "./Link";

const Navbar = ({ navLinks }) => {
    return (
        <Toolbar
            component="nav"
            sx={{
                display: { xs: `none`, md: `flex` },
            }}
        >
            <Stack direction="row" spacing={4}>
                {navLinks.map(({ title, path }, i) => (
                    <MuiNextLink
                        key={`${title}${i}`}
                        href={path}
                        variant="button"
                        sx={{
                            color: "black",

                            "&:hover": {
                            color: "primary.main",
                            },}}
                    >
                        {title}
                    </MuiNextLink>
                ))}
            </Stack>
        </Toolbar>
    );
};

export default Navbar;