import Grid from "@mui/material/Grid";
// import StasCard from "../InfoDisplay/StatsCard";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Image from "next/image";
import {toHumanString} from "../humanize";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useState} from "react";
import Box from "@mui/material/Box";
import * as echarts from "echarts/core";
import Echarts from "../Viz/echarts-obj";
import {CanvasRenderer} from "echarts/renderers";
import {TitleComponent, GridComponent, TooltipComponent} from "echarts/components";
import {BarChart} from "echarts/charts";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";

echarts.use([
    CanvasRenderer,
    BarChart,
    GridComponent,
    TitleComponent,
    TooltipComponent
])


const getOptions = (title, statsDetails) => {
    const xdata = [];
    const ydata = [];

    statsDetails.sort((a, b) => a.count - b.count).map((i) => {
        xdata.push(i.count);
        ydata.push(i.field)
    })

    return {
        title: {
            text: title,
            left: "center",
        },
        grid: {
            containLabel: true
        },
        tooltip: {
            show: true
        },
        yAxis: {
            type: 'category',
            data: ydata,
        },
        xAxis: {
            type: 'value',
        },
        series: [
            {
                type: 'bar',
                data: xdata,
                label: {
                    show: true,
                    position: 'right',
                    valueAnimation: true
                }
            }
        ]
    }
}

const StatsCardViz = ({title, data, startIcon, statsDetails}) => {

    const [open, setOpen] = useState(false);

    return (
        <Stack direction="row"
               alignItems="center"
               spacing={2}
               sx={{
                   m: 1,
                   p: 3,
                   border: 1.5,
                   borderColor: 'divider',
                   borderRadius: '10px',
                   '&:hover': {
                       borderColor: 'primary.main',
                       transition: '200ms',
                       cursor: 'pointer',
                   }
               }}>
            <Tooltip title={"Click to view details"}>
                <Box onClick={() => setOpen(true)}>
                    {startIcon}
                </Box>
            </Tooltip>
            <Divider orientation="vertical" flexItem/>
            <Dialog
                open={open}
                onClick={() => setOpen(false)}
            >
                <Box sx={{
                    bgcolor: 'background.paper',
                    // width: 800,
                    // height: 800,
                    //border: '2px solid #000',
                    //boxShadow: 24,
                    p: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Echarts
                        echarts={echarts}
                        option={getOptions(title, statsDetails)}
                        style={{width: 600, height: 600}}
                    />
                </Box>
            </Dialog>
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

const StatsCard = ({title, data, startIcon}) => {
    return (
        <Stack direction="row"
               alignItems="center"
               justifyContent="center"
               spacing={2}
               sx={{
                   m: 1,
                   p: 3,
                   // border: 1.5,
                   // borderColor: 'divider',
                   // borderRadius: '10px',
               }}>
            {startIcon}
            <Divider orientation="vertical" flexItem/>
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
        <>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mt: {
                    xs: 2,
                    md: 4,
                },
                mb: {
                    xs: 1,
                    md: 3,
                },
            }}>
                <Typography variant="h4" fontFamily="Plus Jakarta Sans" fontWeight="600">Database
                    Statistics</Typography>
            </Box>

            <Grid container
                  direction="column"
                  justifyContent={downSM ? "flex-start" : "center"}
                  alignItems={downSM ? "flex-start" : "center"}
                  spacing={downSM ? 2 : 4}
            >
                <Grid item>
                    <Grid container
                          direction={downSM ? "column" : "row"}
                          alignItems={downSM ? "flex-start" : "center"}
                          justifyContent={downSM ? "flex-start" : "center"}
                          spacing={downSM ? 2 : 4}>
                        <Grid item>
                            <StatsCard title={"Dataset"} data={data.data_count} startIcon={
                                <Image alt="data" src="/icons/Data-min.svg" width={width} height={height}/>
                            }/>
                        </Grid>
                        <Grid item>
                            <StatsCard title={"Publication"} data={data.publication_count} startIcon={
                                <Image alt="roi" src="/icons/Publication-min.svg" width={width} height={height}/>
                            }/>
                        </Grid>
                        <Grid item>
                            <StatsCard title={"Cell/Spot"} data={toHumanString(data.total_cell)} startIcon={
                                <Image alt="cell" src="/icons/Cell-min.svg" width={width} height={height}/>
                            }/>
                        </Grid>

                        <Grid item>
                            <StatsCard title={"ROI"} data={toHumanString(data.total_roi)} startIcon={
                                <Image alt="roi" src="/icons/ROI-min.svg" width={width} height={height}/>
                            }/>
                        </Grid>

                    </Grid>

                </Grid>
                <Grid item>
                    <Grid container direction={downSM ? "column" : "row"} alignItems={downSM ? "flex-start" : "center"}
                          spacing={spacingRow2}>
                        <Grid item>
                            <StatsCardViz title={"Disease"}
                                          data={data.disease_count}
                                          statsDetails={data.disease_distinct}
                                          startIcon={
                                              <Image alt="disease" src="/icons/Disease-min.svg" width={width}
                                                     height={height}/>
                                          }/>
                        </Grid>

                        <Grid item>
                            <StatsCardViz
                                title={"Tissue"}
                                data={data.tissue_count}
                                statsDetails={data.tissue_distinct}
                                startIcon={
                                    <Image alt="tissue" src="/icons/Tissue-min.svg" width={width} height={height}/>
                                }/>
                        </Grid>

                        <Grid item>
                            <StatsCardViz title={"Technology"}
                                          data={data.technology_count}
                                          statsDetails={data.technology_distinct}
                                          startIcon={
                                              <Image alt="tech" src="/icons/Technology-min.svg" width={width}
                                                     height={height}/>
                                          }/>
                        </Grid>


                    </Grid>
                </Grid>

            </Grid>
        </>
    )
}

export default StatsIntro;