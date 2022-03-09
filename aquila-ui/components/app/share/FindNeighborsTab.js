import {runCellNeighbors} from "data/post";
import NeighborsMap from "components/Viz/NeighborsMap";
import {useCallback, useEffect, useRef, useState} from "react";
import Selector from "components/Selector";
import NumberInput, {isPosInt} from "components/NumberInput";
import axios from "axios";
import RunButton from "./RunAnalysisButton";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import ParamWrap from "../../ParamWrap";
import OneItemCenter from "../../OneItemCenter";
import Ranger from "../../Ranger";
import GraphGL from "../../Viz/GraphGL";
import {getBBox} from "../../compute/geo";
import natsort from "natsort";


const getRunBody = (cx, cy, ct, method, r, k) => {
    let parsedK = parseInt(k);
    let parsedR = parseInt(r);
    let parsedMethod = method;

    if (method === "kd-tree-1") {
        parsedK = 0
    } else if (method === "kd-tree-2") {
        parsedR = -1
    }

    if (method !== "delaunay") {
        parsedMethod = "kd-tree"
    }

    const body = {
        x: cx,
        y: cy,
        method: parsedMethod,
        r: parsedR,
        k: parsedK + 1,
    }
    return body;
}


// const NeighborsMap = ({show, cx, cy, ct, getNeighbors}) => {
//     if (show === 0) {
//         return <></>
//     } else {
//         const neighborsData = getNeighbors();
//         return <CellMap
//             showNeighbors={true}
//             cx={cx}
//             cy={cy}
//             ct={ct}
//             neighborsOne={neighborsData.p1}
//             neighborsTwo={neighborsData.p2}
//         />
//     }
// }


const FindNeighborsTab = ({cellData, updateNeighbors, getNeighbors}) => {
    console.log(cellData)
    const r = useRef(10);

    const [method, setMethod] = useState("kd-tree-2");
    const [k, setK] = useState(3);
    const [errorR, setErrorR] = useState(false);
    const [errorK, setErrorK] = useState(false);
    const [raiseRunError, setRaiseRunError] = useState(false);
    const [showViz, setShowViz] = useState(0);

    useEffect(() => {
        setShowViz(0);
    }, [cellData]);

    const plotX = useCallback(() => {
        const bbox = getBBox(cellData.cell_x, cellData.cell_y);
        const oy = bbox.y2;
        const ox = bbox.x2;
        return cellData.cell_x.map((x) => {return - x + ox} )
    }, [cellData])
    const cell_x = plotX();

    const handleMethodSelect = (e) => {
        setMethod(e.target.value)
    };

    const checkR = (e) => {
        if (!isPosInt(e.target.value)) {
            setErrorR(true)
        } else {
            setErrorR(false);
            r.current = e.target.value;
        }
    };

    const checkK = (e) => {
        if (!isPosInt(e.target.value) || (e.target.value > 10)) {
            setErrorK(true)
        } else {
            setErrorK(false);
            k.current = e.target.value;
        }
    };

    const handleRun = () => {
        if ((method === "kd-tree-3") && (errorR || errorK)) {
            setRaiseRunError(true)
        } else if ((method === "kd-tree-1") && errorR) {
            setRaiseRunError(true)
        } else if ((method === "kd-tree-2") && errorK) {
            setRaiseRunError(true)
        } else {
            const body = getRunBody(cellData.cell_x, cellData.cell_y, cellData.cell_type, method, r.current, k);
            console.log(body)
            axios.post(runCellNeighbors, body).then((res) => {
                updateNeighbors(res.data)
                setShowViz(showViz + 1)
            }).catch((e) => console.log(e))
        }
    }
    const neighborsData = getNeighbors();

    if (!cellData) {return null}


    return (
            <Stack direction="row">
                <Stack sx={{
                    borderRight: 1, borderColor: "divider", pr: 2,
                    minWidth: "280px",
                    minHeight: "350px"
                }} spacing={2}>
                    <Typography variant="subtitle2">{"Find the neighbors for cells"}</Typography>
                    <Divider/>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Selector title="Method" value={method} onChange={handleMethodSelect} items={{
                            'kd-tree-2': 'KD Tree (KNN)',
                            'kd-tree-1': 'KD Tree (Radius)',
                            'kd-tree-3': 'KD Tree (Radius + KNN)',
                            'delaunay': 'Delaunay Triangulation',
                        }}/>
                        <RunButton onClick={handleRun} onTipOpen={raiseRunError}
                                   onTipClose={() => setRaiseRunError(false)}/>
                    </Stack>
                    <Divider/>
                    <ParamWrap show={(method === 'kd-tree-1') || (method === 'kd-tree-3')}>
                        <NumberInput
                            label={"Search Radius"}
                            error={errorR}
                            helperText="Positive Integer"
                            onChange={checkR}
                            defaultValue={r.current}
                            description={"Cells that intersect with the radius range of the center cell will be consider as neighbors"}
                            sx={{maxWidth: "120px"}}
                        />
                    </ParamWrap>
                    <ParamWrap show={(method === 'kd-tree-2') || (method === 'kd-tree-3')}>
                        <Ranger value={k} min={1} max={15} step={1} onChange={(_, v) => setK(v)} title={"Number of neighbors (K)"} />
                    </ParamWrap>
                </Stack>
                <OneItemCenter>
                        {
                            showViz ? <GraphGL
                                title={"Cell Neighobrs"}
                                cx={cell_x}
                                cy={cellData.cell_y}
                                p1={neighborsData.p1}
                                p2={neighborsData.p2}
                                rotate={180}
                            /> : <></>
                        }
                    </OneItemCenter>
            </Stack>
    )
}

export default FindNeighborsTab;