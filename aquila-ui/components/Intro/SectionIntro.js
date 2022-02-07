import Image from "next/image";
import Typography from "@mui/material/Typography";
import MuiNextLink from "components/Link";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

const SectionIntro = () => {

    return (
        <>
            <Grid container direction="row" alignItems="center" justifyContent="space-evenly" sx={{
                my: {sm: 4}
            }}>
                <Grid item xs={10} sm={6} md={4} sx={{textAlign: "center"}}>
                    <Box sx={{ maxWidth: 500 }}>
                        <Typography variant="h4" gutterBottom>
                            {`What's Aquila?`}
                        </Typography>
                        <Typography>
                            {`Aquila is a spatial single cell pathology database, 
                        we collect single cell data with spatial information.`}
                        </Typography>
                        <MuiNextLink href="/view">
                        <Button variant="outlined" disableElevation sx={{my: 2}}>
                            Browse Data
                        </Button>
                    </MuiNextLink>
                    </Box>


                </Grid>
                <Grid item xs={10} sm={6} md={4}>
                    <Image
                        src={"/undraw_projections_re_1mrh.svg"}
                        alt={"data visualization"}
                        layout={"responsive"}
                        width={850}
                        height={350}
                    />
                </Grid>
            </Grid>

            <Grid container direction="row" alignItems="center" justifyContent="space-evenly"
                  sx={{my: {sm: 4}}}>

                <Grid item xs={10} sm={6} md={4} sx={{mb: {xs: 2}}}>
                    <Image
                        src={"/undraw_data_extraction_re_0rd3.svg"}
                        alt={"data visualization"}
                        layout={"responsive"}
                        width={850}
                        height={450}
                        priority
                    />
                </Grid>

                <Grid item xs={10} sm={6} md={4} sx={{textAlign: "center"}}>
                    <Typography component="h2" variant="h4" gutterBottom>
                        {`Want more?`}
                    </Typography>
                    <Typography component="p">
                        {`Submit your own spatial single-cell data
                         and run spatial analysis without writing a single line of code!`}
                    </Typography>
                    <MuiNextLink href="/analysis">
                        <Button variant="outlined" disableElevation sx={{my: 2}}>
                            Analyze Data
                        </Button>
                    </MuiNextLink>
                </Grid>

            </Grid>
        </>
    );
};

export default SectionIntro;
