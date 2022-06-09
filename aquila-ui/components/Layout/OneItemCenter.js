import Grid from "@mui/material/Grid";

const OneItemCenter = ({children, ...props}) => {
    return <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '100%'}}>
        <Grid item {...props}>
            {children}
        </Grid>
    </Grid>
}

export default OneItemCenter;