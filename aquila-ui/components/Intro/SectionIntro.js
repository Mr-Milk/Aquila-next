import Image from "next/image";
import Typography from "@mui/material/Typography";
import MuiNextLink from "components/Link";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";


const WrapBox = ({children}) => {
    return <Box sx={{maxHeight: "500px", maxWidth: "500px", textAlign: "center"}}>
        {children}
    </Box>
}

const IntroNav = ({title, description, buttonText, href}) => {
    return <WrapBox>
        <Typography variant="h4" gutterBottom>
            {title}
        </Typography>
        <Typography>{description}</Typography>
        <MuiNextLink href={href}>
            <Button variant="outlined" disableElevation sx={{my: 2}}>
                {buttonText}
            </Button>
        </MuiNextLink>
    </WrapBox>
}

const SectionIntro = () => {

    return (
        <>
            <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}
                  sx={{
                      mt: {sm: 2},
                  }}>
                <Grid item xs={10} sm={5}>
                    <IntroNav
                        title={`What's Aquila?`}
                        description={`Aquila is a spatial single cell pathology database, 
                        we collect single cell data with spatial information.`}
                        href="/view"
                        buttonText={"Browse Data"}
                    />
                </Grid>

                <Grid item xs={10} sm={5}>

                    <Image
                        src={"/3d-tissue.png"}
                        alt={"3d tissue"}
                        layout={"responsive"}
                        width={1618}
                        height={1362}
                        priority
                    />

                </Grid>
            </Grid>

            <Grid container direction="row" justifyContent="center" alignItems="center" spacing={1}
                  sx={{
                      mt: {sm: 2},
                  }}>
                <Grid item xs={10} sm={5}>
                    <Image
                        src={"/undraw_data_extraction_re_0rd3.svg"}
                        alt={"data visualization"}
                        layout={"responsive"}
                        width={850}
                        height={450}
                        priority
                    />

                </Grid>

                <Grid item xs={10} sm={5} sx={{mt: 2}}>
                    <IntroNav
                        title={`Want more?`}
                        description={`Submit your own spatial single-cell data
                         and run spatial analysis without writing a single line of code!`}
                        href="/analysis"
                        buttonText={"Analyze Data"}
                    />
                </Grid>

            </Grid>
        </>
    );
};

export default SectionIntro;
