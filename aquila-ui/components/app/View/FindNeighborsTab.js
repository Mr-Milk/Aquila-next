import {runCellNeighbors} from "@/data/post";
import useSWR from "swr";
import {fetcher, getCellInfoURL} from "@/data/get";
import CellMap from "@/components/Viz/CellMap";
import Grid from "@mui/material/Grid";
import {useEffect, useRef, useState} from "react";
import Selector from "@/components/Selector";
import NumberInput, {isPosInt} from "@/components/NumberInput";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert"
import axios from "axios";


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


const FindNeighborsTab = ({roiID, updateNeighbors, neighborsData}) => {

    const {data: cellData, _} = useSWR(`${getCellInfoURL}/${roiID}`, fetcher);

    const r = useRef(10);
    const k = useRef(3);

    const [method, setMethod] = useState("kd-tree-2");
    const [errorR, setErrorR] = useState(false);
    const [errorK, setErrorK] = useState(false);
    const [raiseRunError, setRaiseRunError] = useState(false);
    const [showViz, setShowViz] = useState(0);

    useEffect(() => {
        setShowViz(0);
    }, [roiID]);

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
            const body = getRunBody(cellData.cell_x, cellData.cell_y, cellData.cell_type, method, r.current, k.current);
            axios.post(runCellNeighbors, body).then((res) => {
                updateNeighbors(res.data)
                setShowViz(showViz + 1)
            }).catch((e) => console.log(e))
        }
    }

    if (!cellData) {
        return <></>
    }


    return (
        <>
            <Grid container flexDirection="row" alignItems="center" justifyContent="flex-start" spacing={2}>
                <Grid item>
                    <Selector title="Method" value={method} onChange={handleMethodSelect} items={{
                        'kd-tree-2': 'KD Tree (KNN)',
                        'kd-tree-1': 'KD Tree (Radius)',
                        'kd-tree-3': 'KD Tree (Radius + KNN)',
                        'delaunay': 'Delaunay Triangulation',
                    }}/>
                </Grid>
                <Grid item style={{display: ((method === 'kd-tree-1') || (method === 'kd-tree-3')) ? 'block' : 'none'}}>
                    <NumberInput
                        label={"Search Radius"}
                        error={errorR}
                        helperText="Positive Integer"
                        onChange={checkR}
                        defaultValue={r.current}
                        description={"Cells that intersect with the radius range of the center cell will be consider as neighbors"}
                        sx={{maxWidth: "120px"}}
                    />
                </Grid>
                <Grid item style={{display: ((method === 'kd-tree-2') || (method === 'kd-tree-3')) ? 'block' : 'none'}}>
                    <NumberInput
                        label={"K Neighbors"}
                        error={errorK}
                        helperText="Integer from 1 to 10"
                        onChange={checkK}
                        defaultValue={k.current}
                        sx={{maxWidth: "120px"}}
                    />
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        disableElevation
                        sx={{color: "common.white"}}
                        onClick={handleRun}
                    >
                        Run
                    </Button>
                    <Snackbar
                        open={raiseRunError}
                        autoHideDuration={6000}
                        message="Invalid Input Parameter"
                        security="error"
                        onClose={() => setRaiseRunError(false)}
                    >
                        <Alert onClose={() => setRaiseRunError(false)} severity="error" sx={{width: '100%'}}>
                            Invalid input parameter
                        </Alert>
                    </Snackbar>
                </Grid>
            </Grid>
            <Grid component={"div"} container flexDirection="row" justifyContent="center" alignItems="center">
                <Grid component={"div"} item sx={{mt: 2}}>
                    {
                        showViz ? <CellMap
                            showNeighbors={true}
                            cx={cellData.cell_x}
                            cy={cellData.cell_y}
                            ct={cellData.cell_type}
                            neighborsOne={neighborsData.p1}
                            neighborsTwo={neighborsData.p2}
                        /> : <></>
                    }
                </Grid>
            </Grid>

        </>

    )
}

export default FindNeighborsTab;