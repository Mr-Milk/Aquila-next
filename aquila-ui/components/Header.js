import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import {styled} from "@mui/styles";
import Home from "@mui/icons-material/Home"
import MuiNextLink from "@/components/Link";
import Navbar from '@/components/Navbar';
import SideDrawer from "@/components/SideDrawer";
import HideOnScroll from "@/components/HideOnScroll";
import ClientOnly from "@/components/ClientOnly";
import Image from "next/image";

export const navLinks = [
    {title: "Home", path: "/"},
    {title: "Browse", path: "/view"},
    {title: "Analysis", path: "/analysis"},
    {title: "Tutorial", path: "/tutorial"},
    {title: "About", path: "/about"},
]


const Offset = styled("div")(({theme}) => theme.mixins.toolbar);

const Header = () => {
    return (
        <>
            <HideOnScroll>
                <AppBar position="fixed" elevation={0}
                        sx={{
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            // backgroundBlendMode: "blur",
                            borderBottomStyle: "solid",
                            borderBottomWidth: "1px",
                            backdropFilter: "blur(8px)",
                            borderBottomColor: "#d3d3d3"
                        }}>
                    <Toolbar>
                        <Container
                            maxWidth={'xl'}
                            sx={{display: `flex`, justifyContent: `space-between`}}
                        >
                            {/*<IconButton edge="start" aria-label="home">*/}
                            <MuiNextLink activeClassName="active" href="/" sx={{mt: 1}}>
                                <Image src="/AQUILA-LOGO.svg" width="151" height="57" aria-label="Home"/>
                            </MuiNextLink>

                            {/*</IconButton>*/}
                            <Navbar navLinks={navLinks}/>
                            <SideDrawer navLinks={navLinks}/>
                        </Container>
                    </Toolbar>
                </AppBar>
            </HideOnScroll>
            <ClientOnly>
                <Offset/>
            </ClientOnly>
        </>
    );
};

export default Header;
