import {Container} from "@mui/material";
import SectionIntro from "components/Intro/SectionIntro";
import {fetcher, getDbStatsURL} from "data/get";
import StatsIntro from "../components/Intro/StatsIntro";
import FeaturesIntro from "../components/Intro/FeaturesIntro";

const Home = ({ dbStats }) => {

    return (
        <Container component="section" maxWidth="xl" sx={{mt: {sm: 2, xs: 4}, mb: 2}}>
            <SectionIntro/>
            <StatsIntro data={dbStats}/>
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