import {Container, Grid} from "@mui/material";
import Image from "next/image";
import Typography from "@mui/material/Typography";

function Item() {
    return null;
}

const NotFoundPage = () => {
    return (
        <Container component={"section"} maxWidth={"sm"} sx={{ mt: 16, mb: 16 }}>
            <Grid container rowSpacing={3} flexDirection={"row"}>
                <Grid item xs={12}>
                    <Image
                        src={"/undraw_taken_re_yn20.svg"}
                        alt={"data visualization"}
                        layout={"responsive"}
                        width={400}
                        height={300}
                    />
                </Grid>
                <Grid item xs={12} sx={{ mt: 4, textAlign: "center" }}>
                    <Typography variant={"subtitle2"} sx={{ pb: 2 }}>404 Not Found</Typography>
                    <Typography variant={"h5"}>
                        Oops! The page you are looking for is hijacked by UFO.
                    </Typography>
                </Grid>
            </Grid>

        </Container>

    )
}

export default NotFoundPage;