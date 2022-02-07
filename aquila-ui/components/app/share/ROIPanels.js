import Grid from "@mui/material/Grid";
import Histogram from "../../Viz/Histogram";
import ExpMap from "../../Viz/ExpressionMap";
import CellMap from "../../Viz/CellMap";

export const ExpPanel = ({ cellData, expData, marker }) => {

    return (
        <Grid container flexDirection="row" justifyContent="center" alignItems="top">
            <Grid item>
                <Grid container flexDirection="column" justifyContent="center" alignItems="center">
                    <Grid item>
                        <Histogram arr={expData.expression} title="Expression distribution"/>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <ExpMap
                    cx={cellData.cell_x}
                    cy={cellData.cell_y}
                    exp={expData.expression}
                    markerName={marker}/>
            </Grid>
        </Grid>
    )
}

export const CellMapPanel = ({ cellData }) => {
    console.log(cellData)
    return (
        <Grid component={"div"} container flexDirection="row" justifyContent="center">
            <Grid component={"div"} item>
                <CellMap cx={cellData.cell_x} cy={cellData.cell_y} ct={cellData.cell_type} showNeighbors={false}/>
            </Grid>
        </Grid>
    )
}