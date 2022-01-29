import Grid from "@mui/material/Grid";
// import StasCard from "../InfoDisplay/StatsCard";
import {IoStatsChart} from "react-icons/io5";
import {FaLungsVirus} from "react-icons/fa";
import {GiHeartOrgan} from "react-icons/gi";
import useSWR from "swr";
import {fetcher, getDbStatsURL} from "data/get";
import Typography from "@mui/material/Typography";
import {IconContext} from "react-icons";
import Puzzle from "../icons/Puzzle";
import Lung from "../icons/Lung";
import Cells from "../icons/Cells";
import Badperson from "../icons/Badperson";


const StatsCard = ({ data, title, children }) => {
    return (
        <Grid container flexDirection="column" justifyContent="center" alignItems="center" >
            <Grid item>
                { children }
            </Grid>
            <Typography variant="h4">
                { data }
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.72 }}>
                { title }
            </Typography>
        </Grid>

    )
}


const StatsIntro = () => {

    const { data } = useSWR(getDbStatsURL, fetcher);

    let dataCount, diseaseCount, tissueCount = [0, 0, 0];

    if (data !== undefined) {
        dataCount = data.data_count;
        diseaseCount = data.disease_count;
        tissueCount = data.tissue_count;
    }

    return (
        <Grid container flexDirection="row" alignItems="center" justifyContent="space-evenly" sx={{
            my: 6, px: 8,
        }}>
            <Grid item>
                <StatsCard title={"Total Data"} data={dataCount}>
                    <Puzzle width={50} height={50}/>
                </StatsCard>
            </Grid>
            <Grid item>
                <StatsCard title={"Total Disease"} data={diseaseCount}>
                    <Badperson width={50} height={50}/>
                </StatsCard>
            </Grid>
            <Grid item>
                <StatsCard title={"Total Tissue"} data={tissueCount}>
                    <Cells width={50} height={50}/>
                </StatsCard>
            </Grid>
        </Grid>
    )
}

export default StatsIntro;