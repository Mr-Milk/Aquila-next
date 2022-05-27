import ExpDist from "../../Viz/ExpDist";
import ExpMap2D from "../../Viz/ExpMap2D";
import CellMap2D from "../../Viz/CellMap2D";
import VirtualizedAutoComplete from "../../InputComponents/VirtualizedAutoComplete";
import {useEffect, useState} from "react";
import Stack from "@mui/material/Stack";
import {responsiveSymbolSize} from "../../Viz/responsiveSize";
import Ranger from "../../InputComponents/Ranger";
import OneItemCenter from "../../Layout/OneItemCenter";
import LeftPanel from "../../Layout/LeftPanel";
import SectionTitleWrap from "../../InputComponents/SectionTitleWrap";
import ParamWrap from "../../InputComponents/ParamWrap";
import Typography from "@mui/material/Typography";


export const ExpPanel = ({roiID, cellData, markers, getExpDataFn}) => {

    const cellCount = cellData.cell_x.length;
    const [marker, setMarker] = useState(markers[0]);
    const changeMarker = (e, v) => setMarker(v);


    const {data: expData} = getExpDataFn(roiID, marker);
    const [symbolSize, setSymbolSize] = useState(1);
    const [canvasSize, setCanvasSize] = useState(450);

    useEffect(() => {
        setSymbolSize(responsiveSymbolSize(cellCount))
    }, [cellCount])

    return (
        <Stack direction="row">
            <LeftPanel sx={{minWidth: '350px'}}>
                <ParamWrap>
                    <VirtualizedAutoComplete
                        options={markers}
                        label={'Select or Search Marker'}
                        value={marker}
                        onChange={changeMarker}
                    />
                </ParamWrap>
                <ParamWrap>
                    <ExpDist arr={expData.expression} title="Expression distribution"/>
                </ParamWrap>
                <ParamWrap>
                    <Ranger value={symbolSize} min={1} max={10} step={1} title={"Point Size"}
                            onChange={(_, v) => setSymbolSize(v)}/>
                </ParamWrap>
                <ParamWrap>
                    <Ranger value={canvasSize} min={400} max={1000} step={10} title={"Canvas Size"}
                            onChange={(_, v) => setCanvasSize(v)}/>
                </ParamWrap>

            </LeftPanel>

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

export const CellMapPanel = ({cellData, roiMeta, bbox}) => {

    //console.log(roiMeta)

    const cellCount = cellData.cell_x.length;
    const bboxText = `${Math.abs(bbox.x2 - bbox.x1).toFixed(0)} × ${Math.abs(bbox.y2 - bbox.y1).toFixed(0)}`
    const [symbolSize, setSymbolSize] = useState(1);
    const [canvasSize, setCanvasSize] = useState(450);

    useEffect(() => {
        setSymbolSize(responsiveSymbolSize(cellCount))
    }, [cellCount])

    return (
        <Stack direction="row" sx={{height: '100%'}}>
            <LeftPanel>
                <SectionTitleWrap title={`Current ROI`}>
                    {
                        roiMeta.map((r, i) => {
                            return <Stack key={i} direction="row" spacing={1}>
                                <Typography variant={"subtitle2"} fontWeight={400}>{r.header}</Typography>
                                <Typography variant={"subtitle2"} sx={{color: "secondary.main"}}>{r.value}</Typography>
                            </Stack>
                        })
                    }
                </SectionTitleWrap>
                <SectionTitleWrap title={`ROI Dimension:`} value={bboxText}/>
                <SectionTitleWrap title={`Number of Cells:`} value={cellCount}/>
                <ParamWrap>
                    <Ranger value={symbolSize} min={1} max={10} step={1} title={"Point Size"}
                            onChange={(_, v) => setSymbolSize(v)}/>
                </ParamWrap>
                <ParamWrap>
                    <Ranger value={canvasSize} min={400} max={1000} step={10} title={"Canvas Size"}
                            onChange={(_, v) => setCanvasSize(v)}/>
                </ParamWrap>
            </LeftPanel>

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