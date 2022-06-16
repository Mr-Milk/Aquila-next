import ExpDist from "../../Viz/ExpDist";
import {ExpMap2D, ExpMap2DThumbNail} from "../../Viz/ExpMap2D";
import {CellMap2D} from "../../Viz/CellMap2D";
import VirtualizedAutoComplete from "../../InputComponents/VirtualizedAutoComplete";
import {memo, useEffect, useState} from "react";
import Stack from "@mui/material/Stack";
import {responsiveSymbolSize} from "../../Viz/responsiveSize";
import Ranger from "../../InputComponents/Ranger";
import OneItemCenter from "../../Layout/OneItemCenter";
import LeftPanel from "../../Layout/LeftPanel";
import SectionTitleWrap from "../../InputComponents/SectionTitleWrap";
import ParamWrap from "../../InputComponents/ParamWrap";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import ColorMapSelect from "../../InputComponents/ColorMapSelect";
import {CoExpMap2D} from "../../Viz/CoExpMap2D";
import Checkbox from "@mui/material/Checkbox";
import SectionExplainer from "../../InputComponents/SectionExplainer";
import {ExpMap3D, ExpMap3DThumbNail} from "../../Viz/ExpMap3D";
import {CoExpMap3D} from "../../Viz/CoExpMap3D";
import {CellMap3D} from "../../Viz/CellMap3D";


const ExpPreviewItem = ({roiID, cellData, marker, is3D, getExpDataFn, setCurrentMarker}) => {
    const {data: expData} = getExpDataFn(roiID, marker);
    return (
        <Grid item>
            <Stack alignItems="center" spacing={1} onClick={() => {
                setCurrentMarker(marker)
            }}
                   sx={{
                       p: 1,
                       cursor: 'pointer',
                       borderWidth: 1,
                       borderStyle: 'solid',
                       borderColor: 'rgba(0,0,0,0)',
                       '&:hover': {
                           borderColor: 'primary.main',
                           background: "rgba(253,151,0,0.1)",
                           transition: 'background 0.5s, border-color 0.5s',
                       }
                   }}>
                {
                    is3D ? <ExpMap3DThumbNail
                        cx={cellData.cell_x}
                        cy={cellData.cell_y}
                        cz={cellData.cell_z}
                        exp={expData.expression}
                    /> : <ExpMap2DThumbNail
                        cx={cellData.cell_x}
                        cy={cellData.cell_y}
                        exp={expData.expression}
                    />
                }

                <Typography variant="caption" sx={{color: '#3F1C4F'}}>{marker}</Typography>
            </Stack>
        </Grid>
    )
}

const MemoExpPreviewItem = memo(ExpPreviewItem)


const ExpGallery = ({roiID, cellData, markers, is3D, getExpDataFn, setCurrentMarker}) => {
    return <Grid container spacing={1}
                 alignItems="center" justifyContent="center"
                 sx={{mb: 2}}
    >{
        markers.map((m) => {
            return <MemoExpPreviewItem roiID={roiID} key={m} marker={m} is3D={is3D}
                                       setCurrentMarker={setCurrentMarker}
                                       getExpDataFn={getExpDataFn} cellData={cellData}
            />
        })
    }</Grid>
}


export const ExpPanel = ({roiID, cellData, markers, is3D, getExpDataFn}) => {

    const cellCount = cellData.cell_x.length;
    const [userMarkers, setUserMarkers] = useState([markers[0]]);
    const [currentMarker, setCurrentMarker] = useState(userMarkers[0]);

    const {data: expData} = getExpDataFn(roiID, currentMarker);

    const [symbolSize, setSymbolSize] = useState(1);
    const [canvasSize, setCanvasSize] = useState(is3D ? 650 : 450);

    useEffect(() => {
        setSymbolSize(responsiveSymbolSize(cellCount))
    }, [cellCount])

    return (
        <Stack direction="row">
            <LeftPanel sx={{minWidth: '350px', maxWidth: '400px'}}>
                <ParamWrap>
                    <VirtualizedAutoComplete
                        multiple={true}
                        disableCloseOnSelect={true}
                        options={markers}
                        label={'Select or Search Markers'}
                        value={userMarkers}
                        onChange={(_, v) => {
                            setUserMarkers(v);
                            // this ensures that every time user click,
                            // the canvas will show the latest one
                            setCurrentMarker(v.slice(-1)[0])
                        }}
                    />
                </ParamWrap>
                <ParamWrap>
                    <ExpDist arr={expData.expression} title={`${currentMarker}`}/>
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
            <Grid container direction="column" alignItems="center" justifyContent="center"
                  sx={{mt: 2}}>
                <Grid item>
                    {
                        is3D ? <ExpMap3D
                            cx={cellData.cell_x}
                            cy={cellData.cell_y}
                            cz={cellData.cell_z}
                            exp={expData.expression}
                            markerName={currentMarker}
                            symbolSize={symbolSize}
                            canvasSize={canvasSize}
                        /> : <ExpMap2D
                            cx={cellData.cell_x}
                            cy={cellData.cell_y}
                            exp={expData.expression}
                            markerName={currentMarker}
                            symbolSize={symbolSize}
                            canvasSize={canvasSize}
                        />
                    }

                </Grid>
                <Grid item sx={{borderTop: 1, borderColor: 'divider', pt: 4}}>
                    <ExpGallery
                        roiID={roiID}
                        cellData={cellData}
                        markers={userMarkers}
                        getExpDataFn={getExpDataFn}
                        setCurrentMarker={setCurrentMarker}
                        is3D={is3D}
                    />
                </Grid>
            </Grid>
        </Stack>
    )
}

export const CellMapPanel = ({cellData, roiMeta, bbox, is3D}) => {

    const cellCount = cellData.cell_x.length;
    let bboxText = `${Math.abs(bbox.x2 - bbox.x1).toFixed(0)} × ${Math.abs(bbox.y2 - bbox.y1).toFixed(0)}`
    if (is3D) {
        bboxText = `${bboxText} × ${Math.abs(bbox.z2 - bbox.z1).toFixed(0)}`
    }
    const [symbolSize, setSymbolSize] = useState(1);
    const [canvasSize, setCanvasSize] = useState(is3D ? 650 : 450);

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
                                <Typography variant={"subtitle2"} sx={{
                                    color: "secondary.main",
                                    wordBreak: 'break-all'
                                }}>{r.value}</Typography>
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

            <OneItemCenter sx={{p: 4}}>
                {
                    is3D ? <CellMap3D
                        cx={cellData.cell_x}
                        cy={cellData.cell_y}
                        cz={cellData.cell_z}
                        ct={cellData.cell_type}
                        symbolSize={symbolSize}
                        canvasSize={canvasSize}
                    /> : <CellMap2D
                        cx={cellData.cell_x}
                        cy={cellData.cell_y}
                        ct={cellData.cell_type}
                        symbolSize={symbolSize}
                        canvasSize={canvasSize}
                    />
                }
            </OneItemCenter>

        </Stack>

    )
}

const CMaps = ["Reds", "Blues", "Greens", "Purples", "Greys"]

const fallbackCoExp = [{
    color: 'Reds',
    name: '',
    values: [1, 2, 3, 4]
}]


export const CoLocPanel = ({roiID, cellData, markers, is3D, getExpDataFn}) => {

    const cellCount = cellData.cell_x.length;
    const [disableCheck, setDisableCheck] = useState(false);
    const [showMarkers, setShowMarkers] = useState([true, true, false, false, false])
    const [userMarkers, setUserMarkers] = useState(markers.slice(0, 5));
    const [userColors, setUserColors] = useState(CMaps);
    const [currentExp, setCurrentExp] = useState(fallbackCoExp);

    // have to create five hooks to make things work
    const {data: expData0} = getExpDataFn(roiID, userMarkers[0]);
    const {data: expData1} = getExpDataFn(roiID, userMarkers[1]);
    const {data: expData2} = getExpDataFn(roiID, userMarkers[2]);
    const {data: expData3} = getExpDataFn(roiID, userMarkers[3]);
    const {data: expData4} = getExpDataFn(roiID, userMarkers[4]);

    useEffect(() => {
        let count = 0;
        showMarkers.map((i) => i ? count += 1 : null)
        if (count === 1) {
            setDisableCheck(true)
        } else {
            setDisableCheck(false)
        }
    }, [showMarkers])

    useEffect(() => {
        const allExp = [expData0, expData1, expData2, expData3, expData4]
        const exp = [];
        let firstLen;
        let returnFallback = false;
        showMarkers.map((show, i) => {
            let currentExp = allExp[i].expression;
            if (i === 0) {
                firstLen = currentExp.length;
            } else {
                returnFallback = !(firstLen === currentExp.length);
            }
            if (show) {
                exp.push({
                    cmap: userColors[i],
                    name: userMarkers[i],
                    values: currentExp
                })
            }
        })
        if (returnFallback) {
            setCurrentExp(fallbackCoExp)
        } else {
            setCurrentExp(exp)
        }
    }, [expData0, expData1, expData2, expData3, expData4, showMarkers, userColors, userMarkers])

    const [symbolSize, setSymbolSize] = useState(1);
    const [canvasSize, setCanvasSize] = useState(450);

    useEffect(() => {
        setSymbolSize(responsiveSymbolSize(cellCount))
    }, [cellCount])

    return (
        <Stack direction="row" sx={{height: '100%'}}>
            <LeftPanel sx={{minWidth: '460px'}}>
                <SectionExplainer title={"Visualize co-localization of markers"}
                                  details={"The color mixing result may not be satisfying if more than 3 markers."}
                                  vizTips={"Hover on the cell to see expression of different markers"}
                                  sx={{maxWidth: '460px'}}
                />
                {
                    [0, 1, 2, 3, 4].map((i) => (
                        <ParamWrap key={i}>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Checkbox size="small" checked={showMarkers[i]}
                                          disabled={showMarkers[i] && disableCheck}
                                          onChange={() => setShowMarkers((prev) => {
                                              let newShowState = [...prev];
                                              newShowState[i] = !(newShowState[i]);
                                              return newShowState
                                          })}
                                />
                                <VirtualizedAutoComplete
                                    sx={{minWidth: '160px'}}
                                    disableCloseOnSelect={false}
                                    options={markers}
                                    label={`Marker${i + 1}`}
                                    value={userMarkers[i]}
                                    onChange={(_, v) => setUserMarkers((prev) => {
                                        let newMarkers = [...prev];
                                        newMarkers[i] = v;
                                        return newMarkers
                                    })}
                                />
                                <ColorMapSelect color={userColors[i]}
                                                options={CMaps}
                                                onColorChange={(color) => setUserColors((prev) => {
                                                    let newColors = [...prev];
                                                    newColors[i] = color;
                                                    return newColors
                                                })
                                                }/>
                            </Stack>
                        </ParamWrap>
                    ))
                }
                <ParamWrap>
                    <Ranger value={symbolSize} min={1} max={10} step={1} title={"Point Size"}
                            onChange={(_, v) => setSymbolSize(v)}/>
                </ParamWrap>
                <ParamWrap>
                    <Ranger value={canvasSize} min={400} max={1000} step={10} title={"Canvas Size"}
                            onChange={(_, v) => setCanvasSize(v)}/>
                </ParamWrap>

            </LeftPanel>
            <OneItemCenter sx={{p: 4}}>
                {
                    is3D ? <CoExpMap3D
                        cx={cellData.cell_x}
                        cy={cellData.cell_y}
                        cz={cellData.cell_z}
                        exp={currentExp}
                        symbolSize={symbolSize}
                        canvasSize={canvasSize}
                    /> : <CoExpMap2D
                        cx={cellData.cell_x}
                        cy={cellData.cell_y}
                        exp={currentExp}
                        symbolSize={symbolSize}
                        canvasSize={canvasSize}
                    />
                }

            </OneItemCenter>

        </Stack>
    )
}