import ExpDist from "../../Viz/ExpDist";
import ExpMap2D from "../../Viz/ExpMap2D";
import CellMap2D from "../../Viz/CellMap2D";
import VirtualizedAutoComplete from "../../VirtualizedAutoComplete";
import {useMemo, useState} from "react";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {responsiveSymbolSize} from "../../Viz/responsiveSize";
import {getBBox} from "../../compute/geo";
import Ranger from "../../Ranger";
import OneItemCenter from "../../OneItemCenter";


export const ExpPanel = ({roiID, cellData, markers, getExpDataFn}) => {

    const cellCount = cellData.cell_x.length;
    const [marker, setMarker] = useState(markers[0]);
    const changeMarker = (e, v) => setMarker(v);

    console.log(marker)

    const {data: expData} = getExpDataFn(roiID, marker);
    console.log(expData)
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

            <OneItemCenter>
                <ExpMap2D
                    cx={cellData.cell_x}
                    cy={cellData.cell_y}
                    exp={expData.expression}
                    markerName={marker}
                    symbolSize={symbolSize}
                    canvasSize={canvasSize}
                />
            </OneItemCenter>
        </Stack>
    )
}

export const CellMapPanel = ({cellData, roiMeta}) => {

    const cellCount = cellData.cell_x.length;
    const bbox = useMemo(() => {
            let bboxV = getBBox(cellData.cell_x, cellData.cell_y)
            return `${Math.abs(bboxV.x2 - bboxV.x1).toFixed(0)} × ${Math.abs(bboxV.y2 - bboxV.y1).toFixed(0)}`
        },
        [cellData.cell_x, cellData.cell_y])
    const [symbolSize, setSymbolSize] = useState(responsiveSymbolSize(cellCount));
    const [canvasSize, setCanvasSize] = useState(450);

    return (
        <Stack direction="row">
            <Stack
                sx={{borderRight: 1, borderColor: "divider", pr: 4, minWidth: "250px"}}
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

            <OneItemCenter>
                <CellMap2D
                    cx={cellData.cell_x}
                    cy={cellData.cell_y}
                    ct={cellData.cell_type}
                    symbolSize={symbolSize}
                    canvasSize={canvasSize}
                />
            </OneItemCenter>

        </Stack>

    )
}