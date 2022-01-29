import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Viewer from "../icons/Viewer";
import Analysis from "../icons/Analysis";
import Security from "../icons/Security";
import {Container} from "@mui/material";

const FeaturesCard = ({ title, content, children }) => {
    return (
        <Grid container flexDirection="column" sx={{
            maxWidth: {md: '250px', xs: '350px'},
            my: {xs: 2 }
        }}>
            <Grid item>
                { children }
            </Grid>
            <Grid item sx={{ mt: 1, mb: 1 }}>
                <Typography variant="h5" fontWeight="500">{ title }</Typography>
            </Grid>
            <Grid item>
                <Typography component="body1">{ content }</Typography>
            </Grid>
        </Grid>
    )
}


const FeaturesIntro = () => {
    return(
        <>
        <Grid container direction="row" justifyContent="space-evenly" alignItems="top" sx={{
            borderTop: 1, borderColor: "divider", py: 6, px: { xs: 4 }
        }}>
            <Grid item>
                <FeaturesCard title="Viewer" content={`Navigation through all ROIs in a dataset, 
                view the spatial distribution of cells and spatial expression of markers`}>
                    <Viewer height={50} width={50}/>
                </FeaturesCard>
            </Grid>
            <Grid item>
                <FeaturesCard title="Analysis" content={`Freely to run all kinds of spatial analysis on any
                dataset, or you can even analysis your own data`}>
                    <Analysis height={50} width={50}/>
                </FeaturesCard>
            </Grid>
            <Grid item>
                <FeaturesCard title="Data Security" content={`All submitted data are stored locally, 
                only analysis essential data will be sent to server and will not be stored.`}>
                    <Security height={50} width={50}/>
                </FeaturesCard>
            </Grid>
        </Grid>
        </>
    )
}

export default FeaturesIntro;