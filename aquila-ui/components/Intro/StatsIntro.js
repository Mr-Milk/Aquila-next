import Grid from "@mui/material/Grid";
// import StasCard from "../InfoDisplay/StatsCard";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Image from "next/image";
import {toHumanString} from "../humanize";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";


const StatsCard = ({title, data, startIcon}) => {
    return (
        <Stack direction="row" alignItems="center" spacing={2} sx={{
            m: 1,
            p: 1,
        }}>
            {startIcon}
            <Stack>
                <Typography variant="h4" sx={{mt: 1}}>
                    {data}
                </Typography>
                <Typography fontWeight="500" sx={{opacity: 0.8}}>
                    {title}
                </Typography>
            </Stack>

        </Stack>
    )
}


const StatsIntro = ({data}) => {

    const theme = useTheme();
    const downSM = useMediaQuery(theme.breakpoints.down('sm'), {noSsr: true})
    const downMD = useMediaQuery(theme.breakpoints.down('md'), {noSsr: true})

    const [width, height] = [65, 65];

    let spacingRow2;
    if (downSM) {
        spacingRow2 = 2
    } else if (downMD) {
        spacingRow2 = 0
    } else {
        spacingRow2 = 4
    }

    return (
        <Grid container
              direction="column"
              justifyContent={downSM ? "flex-start" : "center"}
              alignItems={downSM ? "flex-start" : "center"}
              spacing={downSM ? 2 : 4}
              sx={{
                  my: {
                      xs: 0,
                      md: 2,
                  },
              }}
        >
            <Grid item>
                <Grid container
                      direction={downSM ? "column" : "row"}
                      alignItems={downSM ? "flex-start" : "center"}
                      justifyContent={downSM ? "flex-start" : "center"}
                      spacing={downSM ? 2 : 4}>
                    <Grid item>
                        <StatsCard title={"Dataset"} data={data.data_count} startIcon={
                            <Image alt="data" src="/icons/Data.svg" width={width} height={height}/>
                        }/>
                    </Grid>
                    <Grid item>
                        <StatsCard title={"Publication"} data={data.publication_count} startIcon={
                            <Image alt="roi" src="/icons/Publication.svg" width={width} height={height}/>
                        }/>
                    </Grid>
                    <Grid item>
                        <StatsCard title={"Technology"} data={data.technology_count} startIcon={
                            <Image alt="tech" src="/icons/Technology.svg" width={width} height={height}/>
                        }/>
                    </Grid>

                </Grid>

            </Grid>
            <Grid item>
                <Grid container direction={downSM ? "column" : "row"} alignItems={downSM ? "flex-start" : "center"}
                      spacing={spacingRow2}>
                    <Grid item>
                        <StatsCard title={"Disease"} data={data.disease_count} startIcon={
                            <Image alt="disease" src="/icons/Disease.svg" width={width} height={height}/>
                        }/>
                    </Grid>

                    <Grid item>
                        <StatsCard title={"Tissue"} data={data.tissue_count} startIcon={
                            <Image alt="tissue" src="/icons/Tissue.svg" width={width} height={height}/>
                        }/>
                    </Grid>

                    <Grid item>
                        <StatsCard title={"Cell/Spot"} data={toHumanString(data.total_cell)} startIcon={
                            <Image alt="cell" src="/icons/Cell.svg" width={width} height={height}/>
                        }/>
                    </Grid>

                    <Grid item>
                        <StatsCard title={"ROI"} data={toHumanString(data.total_roi)} startIcon={
                            <Image alt="roi" src="/icons/ROI.svg" width={width} height={height}/>
                        }/>
                    </Grid>

                </Grid>
            </Grid>

        </Grid>
    )
}

export default StatsIntro;