import Grid from "@mui/material/Grid";
// import StasCard from "../InfoDisplay/StatsCard";
import {useDBStats} from "data/get";
import Typography from "@mui/material/Typography";
import Puzzle from "../icons/Puzzle";
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

    const { data } = useDBStats();

    return (
        <Grid container flexDirection="row" alignItems="center" justifyContent="space-between" sx={{
            my: 6, px: {md: 24, xs: 12},
        }}>
            <Grid item>
                <StatsCard title={"Total Data"} data={data.data_count}>
                    <Puzzle width={50} height={50}/>
                </StatsCard>
            </Grid>
            <Grid item>
                <StatsCard title={"Total Disease"} data={data.disease_count}>
                    <Badperson width={50} height={50}/>
                </StatsCard>
            </Grid>
            <Grid item>
                <StatsCard title={"Total Tissue"} data={data.disease_count}>
                    <Cells width={50} height={50}/>
                </StatsCard>
            </Grid>
        </Grid>
    )
}

export default StatsIntro;