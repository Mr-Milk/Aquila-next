import {Container} from "@mui/material";
import SectionIntro from "components/Intro/SectionIntro";
import {fetcher, getDbStatsURL} from "data/get";
import StatsIntro from "../components/Intro/StatsIntro";
import FeaturesIntro from "../components/Intro/FeaturesIntro";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import Button from "@mui/material/Button";
import MuiNextLink from "../components/Link";
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useTheme} from "@mui/material/styles";
import OneItemCenter from "../components/Layout/OneItemCenter";


const LinkButton = ({href, children, ...props}) => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'))

    return <MuiNextLink href={href}>
        <Button variant="contained"
                size={matches ? "medium" : "large"}
                disableElevation
                sx={{
                    textTransform: 'none',
                }}
                {...props}
        >
            {children}
        </Button>
    </MuiNextLink>
}


const Home = ({dbStats}) => {

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true})

    return (
        <Container component="section" maxWidth="xl">

            <Grid container direction="row" justifyContent="center" alignItems="center" spacing={1} sx={{
                py: 4,
                mb: 2,
            }}>
                <Grid item xs={10} md={6}>
                    <Stack spacing={2}>
                        <Typography variant="h2" fontFamily="Plus Jakarta Sans" color="grass" fontWeight="700">Exploring Spatial
                            Omics</Typography>
                        <Typography variant={matches ? "body1" : "h6"} fontWeight="400">{"The spatial omics database with visualization and analysis. From developmental biology to pathology"}</Typography>
                        <Stack direction="row" spacing={2}>
                            <LinkButton href="/view" startIcon={<RocketLaunchRoundedIcon/>}>Explore</LinkButton>
                            <LinkButton href="/analysis" startIcon={<AnalyticsRoundedIcon/>}>Analysis</LinkButton>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid item xs={8} md={4}>
                    <Image
                        src={"/3d-tissue.png"}
                        alt={"3d tissue"}
                        layout={"responsive"}
                        width={953}
                        height={818}
                        priority
                    />
                </Grid>

            </Grid>
            <Divider/>

            {/*<SectionIntro/>*/}
            <OneItemCenter>
                <StatsIntro data={dbStats}/>
            </OneItemCenter>


            <FeaturesIntro/>

        </Container>
    )
}

export async function getStaticProps() {
    const data = await fetcher(getDbStatsURL);

    return {
        props: {
            dbStats: data
        },
        revalidate: 60
    }
}

export default Home;