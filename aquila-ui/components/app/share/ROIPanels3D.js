import Grid from "@mui/material/Grid";
import ExpDist from "../../Viz/ExpDist";
import CellMap3D from "../../Viz/CellMap3D";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ExpMap3D from "../../Viz/ExpMap3D";
import VirtualizedAutoComplete from "../../VirtualizedAutoComplete";
import Divider from "@mui/material/Divider";
import Ranger from "../../Ranger";
import {useMemo, useState} from "react";
import {useExpData} from "../../../data/get";
import {responsiveSymbolSize} from "../../Viz/responsiveSize";
import {getBBox3D} from "../../compute/geo";

export const ExpPanel3D = ({roiID, cellData, markers}) => {
    const cellCount = cellData.cell_x.length;
    const [marker, setMarker] = useState(markers[0]);
    const changeMarker = (e, v) => setMarker(v);

    const {data: expData} = useExpData(roiID, marker);
    const [symbolSize, setSymbolSize] = useState(responsiveSymbolSize(cellCount));
    const [canvasSize, setCanvasSize] = useState(450);


    return (
        <Stack direction="row">

            <Stack
                sx={{borderRight: 1, borderColor: "divider", pr: 4, minWidth: "320px"}}
                spacing={2}
            >
                <VirtualizedAutoComplete
                    options={markers}
                    label={'Select marker'}
                    value={marker}
                    onChange={changeMarker}
                    sx={{width: "200px"}}
                />
                <Divider/>
                <ExpDist arr={expData.expression} title="Expression distribution"/>
                <Divider/>
                <Ranger value={symbolSize} min={1} max={10} step={1} title={"Symbol Size"}
                        onChange={(_, v) => setSymbolSize(v)}/>
                <Divider/>
                <Ranger value={canvasSize} min={400} max={1000} step={10} title={"Canvas Size"}
                        onChange={(_, v) => setCanvasSize(v)}/>
            </Stack>
            <Grid container justifyContent="center" alignItems="center">
                <Grid item>
                    <ExpMap3D
                        cx={cellData.cell_x}
                        cy={cellData.cell_y}
                        cz={cellData.cell_z}
                        exp={expData.expression}
                        markerName={marker}
                        symbolSize={symbolSize}
                        canvasSize={canvasSize}
                    />
                </Grid>
            </Grid>
        </Stack>
    )
}

export const CellMapPanel3D = ({cellData, roiMeta}) => {

    const cellCount = cellData.cell_x.length;
    const bbox = useMemo(() => {
        let bboxV = getBBox3D(cellData.cell_x, cellData.cell_y, cellData.cell_z)
        return `${Math.abs(bboxV.x2 - bboxV.x1).toFixed(0)} × 
        ${Math.abs(bboxV.y2 - bboxV.y1).toFixed(0)} × 
        ${Math.abs(bboxV.z2 - bboxV.z1).toFixed(0)}
        `
    }, [cellData.cell_x, cellData.cell_y, cellData.cell_z])
    const [symbolSize, setSymbolSize] = useState(2);
    const [canvasSize, setCanvasSize] = useState(450);


    return (
        <Stack direction="row">
            <Stack
                sx={{borderRight: 1, borderColor: "divider", pr: 4, minWidth: "280px"}}
                spacing={2}
            >
                <Typography variant="subtitle2">Current ROI: {roiMeta}</Typography>
                <Divider/>
                <Typography variant="subtitle2">ROI Dimension: {bbox}</Typography>
                <Divider/>
                <Typography variant="subtitle2">Number of Cells: {cellCount}</Typography>
                <Divider/>
                <Ranger value={symbolSize} min={1} max={10} step={1} title={"Symbol Size"}
                        onChange={(_, v) => setSymbolSize(v)}/>
                <Divider/>
                <Ranger value={canvasSize} min={400} max={1000} step={10} title={"Canvas Size"}
                        onChange={(_, v) => setCanvasSize(v)}/>
            </Stack>

            <Grid container alignItems="center" justifyContent="center">
                <Grid item>
                    <CellMap3D
                        cx={cellData.cell_x}
                        cy={cellData.cell_y}
                        cz={cellData.cell_z}
                        ct={cellData.cell_type}
                        symbolSize={symbolSize}
                        canvasSize={canvasSize}
                    />
                </Grid>
            </Grid>
        </Stack>
    )
}