import Grid from "@mui/material/Grid";
// import StasCard from "../InfoDisplay/StatsCard";
import {useDBStats} from "data/get";
import Typography from "@mui/material/Typography";
import Puzzle from "../icons/Puzzle";
import Cells from "../icons/Cells";
import Badperson from "../icons/Badperson";
import Stack from "@mui/material/Stack";
import Image from "next/image";
import {toHumanString} from "../humanize";


const StatsCard = ({data, title, children}) => {
    return (
        <Stack alignItems="center">
            {children}
            <Typography variant="h4" sx={{mt: 1}}>
                {data}
            </Typography>
            <Typography sx={{fontWeight: 500, opacity: 0.8}}>
                {title}
            </Typography>
        </Stack>
    )
}


const StatsIntro = ({data}) => {

    return (
        <Grid container alignItems="center" justifyContent="space-between"
              sx={{my: 6, px: {xs: 4, sm: 6, md: 24}}}
        >
            <Grid item>
                <StatsCard title={"Data"} data={data.data_count}>
                    <Image alt="data" src="/icons/data.svg" width={50} height={50}/>
                </StatsCard>
            </Grid>
            <Grid item>
                <StatsCard title={"Technology"} data={data.technology_count}>
                    <Image alt="tech" src="/icons/tech.svg" width={50} height={50}/>
                </StatsCard>
            </Grid>
            <Grid item>
                <StatsCard title={"Disease"} data={data.disease_count}>
                    <Image alt="disease" src="/icons/disease.svg" width={50} height={50}/>
                </StatsCard>
            </Grid>
            <Grid item>
                <StatsCard title={"Tissue"} data={data.disease_count}>
                    <Image alt="tissue" src="/icons/tissue.svg" width={50} height={50}/>
                </StatsCard>
            </Grid>
            <Grid item>
                <StatsCard title={"Cell"} data={toHumanString(data.total_cell)}>
                    <Image alt="cell" src="/icons/cell.svg" width={50} height={50}/>
                </StatsCard>
            </Grid>
            <Grid item>
                <StatsCard title={"ROI"} data={toHumanString(data.total_roi)}>
                    <Image alt="roi" src="/icons/roi.svg" width={50} height={50}/>
                </StatsCard>
            </Grid>
        </Grid>
    )
}

export default StatsIntro;