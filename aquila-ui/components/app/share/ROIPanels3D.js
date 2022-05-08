import ExpDist from "../../Viz/ExpDist";
import CellMap3D from "../../Viz/CellMap3D";
import Stack from "@mui/material/Stack";
import ExpMap3D from "../../Viz/ExpMap3D";
import VirtualizedAutoComplete from "../../InputComponents/VirtualizedAutoComplete";
import Ranger from "../../InputComponents/Ranger";
import {useEffect, useState} from "react";
import {useExpData} from "../../../data/get";
import {responsiveSymbolSize} from "../../Viz/responsiveSize";
import ParamWrap from "../../InputComponents/ParamWrap";
import OneItemCenter from "../../Layout/OneItemCenter";
import LeftPanel from "../../Layout/LeftPanel";
import SectionTitleWrap from "../../InputComponents/SectionTitleWrap";

export const ExpPanel3D = ({roiID, cellData, markers}) => {
    const cellCount = cellData.cell_x.length;
    const [marker, setMarker] = useState(markers[0]);
    const changeMarker = (e, v) => setMarker(v);

    const {data: expData} = useExpData(roiID, marker);
    const [symbolSize, setSymbolSize] = useState(3);
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
                    label={'Select or search marker'}
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
               <ExpMap3D
                        cx={cellData.cell_x}
                        cy={cellData.cell_y}
                        cz={cellData.cell_z}
                        exp={expData.expression}
                        markerName={marker}
                        symbolSize={symbolSize}
                        canvasSize={canvasSize}
                    />
            </OneItemCenter>
        </Stack>
    )
}

export const CellMapPanel3D = ({cellData, roiMeta, bbox}) => {

    const cellCount = cellData.cell_x.length;
    const bboxText = `${Math.abs(bbox.x2 - bbox.x1).toFixed(0)} × 
        ${Math.abs(bbox.y2 - bbox.y1).toFixed(0)} × 
        ${Math.abs(bbox.z2 - bbox.z1).toFixed(0)}
        `
    const [symbolSize, setSymbolSize] = useState(2);
    const [canvasSize, setCanvasSize] = useState(450);

    useEffect(() => {
        setSymbolSize(responsiveSymbolSize(cellCount))
    }, [cellCount])

    return (
        <Stack direction="row" sx={{height: '100%'}}>
            <LeftPanel>
                <SectionTitleWrap title={`Current ROI: ${roiMeta}`}/>
                <SectionTitleWrap title={`ROI Dimension: ${bboxText}`}/>
                <SectionTitleWrap title={`Number of Cells: ${cellCount}`}/>
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
                <CellMap3D
                        cx={cellData.cell_x}
                        cy={cellData.cell_y}
                        cz={cellData.cell_z}
                        ct={cellData.cell_type}
                        symbolSize={symbolSize}
                        canvasSize={canvasSize}
                    />
            </OneItemCenter>
        </Stack>
    )
}