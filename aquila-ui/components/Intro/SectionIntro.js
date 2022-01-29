import Image from "next/image";
import Typography from "@mui/material/Typography";
import MuiNextLink from "components/Link";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

const SectionIntro = () => {
    return (

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} container flexDirection="column" justifyContent="center" alignItems="center">
                    <Typography component="h2" variant="h4" textAlign="center" gutterBottom>
                        {`What's Aquila?`}
                    </Typography>
                    <Typography component="p" textAlign="center">
                        {`Aquila is a spatial single cell pathology database, 
                        we collect single cell data with spatial information.`}
                    </Typography>
                    <MuiNextLink href="/view" sx={{mt: 2}}>
                        <Button variant="outlined" disableElevation>
                            Browse Data
                        </Button>
                    </MuiNextLink>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Image
                        src={"/undraw_projections_re_1mrh.svg"}
                        alt={"data visualization"}
                        layout={"responsive"}
                        width={800}
                        height={600}
                    />
                </Grid>
            </Grid>
    );
};

export default SectionIntro;
