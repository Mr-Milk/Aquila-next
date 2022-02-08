import Grid from "@mui/material/Grid";
// import StasCard from "../InfoDisplay/StatsCard";
import {useDBStats} from "data/get";
import Typography from "@mui/material/Typography";
import Puzzle from "../icons/Puzzle";
import Cells from "../icons/Cells";
import Badperson from "../icons/Badperson";
import Stack from "@mui/material/Stack";


const StatsCard = ({ data, title, children }) => {
    return (
        <Stack alignItems="center">
            { children }
            <Typography variant="h4">
                { data }
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.72 }}>
                { title }
            </Typography>
        </Stack>
    )
}


const StatsIntro = () => {

    const { data } = useDBStats();

    return (
        <Grid container flexDirection="row" alignItems="center" justifyContent="space-between" sx={{
            my: 4, px: { xs: 4, sm: 6, md: 24 }
        }}>
            <Grid item>
                <StatsCard title={"Data"} data={data.data_count}>
                    <Puzzle width={50} height={50}/>
                </StatsCard>
            </Grid>
            <Grid item>
                <StatsCard title={"Disease"} data={data.disease_count}>
                    <Badperson width={50} height={50}/>
                </StatsCard>
            </Grid>
            <Grid item>
                <StatsCard title={"Tissue"} data={data.disease_count}>
                    <Cells width={50} height={50}/>
                </StatsCard>
            </Grid>
        </Grid>
    )
}

export default StatsIntro;