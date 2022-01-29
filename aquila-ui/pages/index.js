import {Container, Grid} from "@mui/material";
import SectionIntro from "components/Intro/SectionIntro";
import {fetcher, getDbStatsURL} from "data/get";
import {SWRConfig} from "swr";
import StatsIntro from "../components/Intro/StatsIntro";
import FeaturesIntro from "../components/Intro/FeaturesIntro";


const Home = ({fallback}) => {

    return (
        <SWRConfig value={{fallback}}>
            <Container component="section" maxWidth="xl" sx={{mt: {sm: 2, xs: 4}, mb: 2}}>
                <SectionIntro/>
                <StatsIntro/>
                <FeaturesIntro/>
            </Container>
        </SWRConfig>
    )
}

export async function getStaticProps() {
    const data = await fetcher(getDbStatsURL);

    return {
        props: {
            fallback: {
                getDbStatsURL: data
            }
        }
    }
}

export default Home;