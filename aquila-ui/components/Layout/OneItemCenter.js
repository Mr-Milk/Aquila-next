import Grid from "@mui/material/Grid";

const OneItemCenter = ({children}) => {
    return <Grid container justifyContent="center" alignItems="center">
        <Grid item>
            {children}
        </Grid>
    </Grid>
}

export default OneItemCenter;