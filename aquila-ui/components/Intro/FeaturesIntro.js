import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Viewer from "../icons/Viewer";
import Analysis from "../icons/Analysis";
import Security from "../icons/Security";
import Stack from "@mui/material/Stack";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

const FeaturesCard = ({title, content, icon}) => {
    return (
        <Paper elevation={4}>
        <Grid container
              direction="column"
              spacing={2}
              sx={{
                  maxWidth: "360px",
                  pt: 2,
                  pb: 4,
                  px: 4,
              }}>
            <Grid item>
                <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={2}>
                    {icon}
                    <Typography variant="h5" fontWeight="500" fontFamily="Plus Jakarta Sans">{title}</Typography>
                </Stack>
            </Grid>
            <Grid item>
                <Typography variant="body1">{content}</Typography>
            </Grid>
        </Grid>
            </Paper>
    )
}


const FeaturesIntro = () => {

    const theme = useTheme();
    const downSM = useMediaQuery(theme.breakpoints.down('sm'), {noSsr: true})

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
                <Typography variant="h4" fontFamily="Plus Jakarta Sans" fontWeight="600">Features</Typography>
            </Box>
        <Grid container
              direction={downSM ? "column" : "row"}
              justifyContent="center"
              alignItems={downSM ? "center" : "flex-start"}
              spacing={4}
              sx={{
                  mt: 4,
                  mb: 8,
              }}
        >
            <Grid item>
                <FeaturesCard
                    icon={<Viewer height={50} width={50}/>}
                    title="Data Viewer"
                    content={`Navigate through all ROIs in a dataset, 
                    and view cells' spatial distribution and markers' spatial expression.`}
                />

            </Grid>
            <Grid item>
                <FeaturesCard
                    icon={<Analysis height={50} width={50}/>}
                    title="Data Analysis"
                    content={`Run all kinds of spatial analyses on any dataset or your data. 
                    No coding skills are required.`}/>
            </Grid>
            <Grid item>
                <FeaturesCard
                    icon={<Security height={50} width={50}/>}
                    title="Data Security"
                    content={`All submitted data are stored locally. 
                    Only analysis essential data is sent to the server and not stored.`}/>
            </Grid>
        </Grid>
            </>
    )
}

export default FeaturesIntro;