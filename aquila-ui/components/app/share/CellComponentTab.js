import Pie from "components/Viz/Pie";
import {Grid} from "@mui/material";

const CellComponentTab = ({ cellData }) => {

    return (
        <Grid container flexDirection="row" justifyContent="center">
            <Grid item>
                <Pie
                    arr={cellData.cell_type}
                    height="350px"
                    width="350px"
                    title="Cell components"
                />
            </Grid>
        </Grid>
    )
}

export default CellComponentTab;