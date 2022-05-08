import Grid from "@mui/material/Grid";

const OneItemCenter = ({children}) => {
    return <Grid container justifyContent="center" alignItems="center" sx={{p: 3, minHeight: '100%'}}>
        <Grid item>
            {children}
        </Grid>
    </Grid>
}

export default OneItemCenter;