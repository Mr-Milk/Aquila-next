import axios from "axios";
import {runCellDistribution} from "data/post";
import Selector from "components/Selector";
import {useEffect, useRef, useState} from "react";
import NumberInput, {inRangeFloat, isPosFloat, isPosInt} from "components/NumberInput";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import natsort from "natsort";
import RunButton from "./RunAnalysisButton";
import Ranger from "../../Ranger";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import OneItemCenter from "../../OneItemCenter";
import ParamWrap from "../../ParamWrap";
import Typography from "@mui/material/Typography";


const getRunBody = (cx, cy, ct, method, pvalue, r, resample, quad) => {
    return {
        x: cx,
        y: cy,
        cell_type: ct,
        method: method,
        pvalue: parseFloat(pvalue),
        r: parseFloat(r),
        resample: parseFloat(resample),
        quad: quad,
    }
}


const patternMap = {
    0: 'No cell',
    1: 'Randomly distributed',
    2: 'Evenly distributed',
    3: 'Cluster'
}

const displayIxValue = (v) => {
    if (v > 0) {
        return v.toFixed(2)
    } else {
        return "-"
    }
}


const ResultTable = ({data}) => {

    const size = data.cell_type.length;

    if (size === 0) {
        return <></>
    } else {
        const rebakeData = [...Array(size).keys()].map((i) => ({
            cell_type: data.cell_type[i],
            pattern: patternMap[data.pattern[i]],
            ix: displayIxValue(data.ix_value[i])
        })).sort(natsort())
        return (
            <TableContainer component={Paper} sx={{minWidth: 400, boxShadow: 0, maxHeight: 400}}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Cell Type</TableCell>
                            <TableCell>Pattern</TableCell>
                            <TableCell>Index Value</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            rebakeData.map((item, i) => (
                                <TableRow key={i}>
                                    <TableCell>{item.cell_type}</TableCell>
                                    <TableCell>{item.pattern}</TableCell>
                                    <TableCell>{item.ix}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }


}


const CellDistributionTab = ({cellData}) => {

    const r = useRef(10);
    const quad = useRef([10, 10]);
    const pvalue = useRef(0.05);
    const result = useRef({cell_type: [], ix_value: [], pattern: []});

    const [method, setMethod] = useState("id");
    const [times, setTimes] = useState(500);
    const [errorR, setErrorR] = useState(false);
    const [errorQuad, setErrorQuad] = useState(false);
    const [errorPvalue, setErrorPvalue] = useState(false);
    const [raiseRunError, setRaiseRunError] = useState(false);
    const [showResult, setShowResult] = useState(0);

    useEffect(() => {
        setShowResult(0);
    }, [cellData]);

    const handleMethodSelect = (e) => setMethod(e.target.value);

    const checkR = (e) => {
        if (!isPosFloat(e.target.value)) {
            setErrorR(true);
        } else {
            setErrorR(false);
            r.current = e.target.value;
        }
    }
    const checkQuad = (e) => {
        const quads = e.target.value.toString().split(",").map((i) => parseInt(i));
        console.log(quads);
        if ((quads.length === 2) && isPosInt(quads[0]) && isPosInt(quads[1])) {
            setErrorQuad(false);
            quad.current = quads;
        } else {
            setErrorQuad(true);
        }
    }

    const checkPvalue = (e) => {
        if (inRangeFloat(e.target.value, 0.0, 1.0, false)) {
            setErrorPvalue(false);
            pvalue.current = e.target.value;
        } else {
            setErrorPvalue(true);
        }
    }

    const handleRun = () => {
        if ((method === "id") && (errorR)) {
            setRaiseRunError(true)
        } else if ((method === "morisita") && errorQuad) {
            setRaiseRunError(true)
        } else {
            const body = getRunBody(cellData.cell_x,
                cellData.cell_y,
                cellData.cell_type,
                method,
                pvalue.current,
                r.current,
                times,
                quad.current,
            );
            console.log(body)
            axios.post(runCellDistribution, body).then((res) => {
                result.current = res.data;
                setShowResult(showResult + 1)
            }).catch((e) => console.log(e))
        }
    }

    if (cellData === undefined) {
        return null
    }
    return (
        <Stack direction="row">
            <Stack sx={{
                borderRight: 1, borderColor: "divider", pr: 2,
                minWidth: "280px",
                minHeight: "350px"
            }}
                   spacing={2}>
                <Typography variant="subtitle2">{"Profiling the distribution pattern of cells"}</Typography>
                <Divider/>
                <Stack direction="row" alignItems="center" spacing={2}>

                    <Selector title="Method" value={method} onChange={handleMethodSelect} items={{
                        'id': 'Index of Dispersion (Random sampling)',
                        'morisita': 'Morisita Index (Quadratic statistic)',
                        'clark-evans': 'Clark-Evans Index (Nearest Neighbors based)',
                    }} sx={{maxWidth: '150px'}}/>
                    <RunButton onClick={handleRun} onTipOpen={raiseRunError}
                               onTipClose={() => setRaiseRunError(false)}/>

                </Stack>
                <Divider/>
                <ParamWrap show={method === 'id'}>
                    <Ranger value={times} min={100} max={2000} step={100}
                            title={"Repeat Times"} onChange={(e, v) => setTimes(v)}/>
                </ParamWrap>
                <ParamWrap show={method === 'id'}>
                    <NumberInput
                        label={"Radius"}
                        error={errorR}
                        helperText="Positive number"
                        onChange={checkR}
                        sx={{maxWidth: "80px"}}
                    />
                </ParamWrap>
                <ParamWrap show={method === 'morisita'}>
                    <NumberInput
                        label={"Quadrilateral"}
                        error={errorQuad}
                        helperText="eg. 10,10"
                        description={"Two side of the quadrilateral use to cut the ROI into pieces. (Example: 10,10)"}
                        useNumber={false}
                        onChange={checkQuad}
                        sx={{maxWidth: "120px"}}
                    />
                </ParamWrap>
                <NumberInput
                    label={"p value"}
                    error={errorPvalue}
                    helperText="Number between 0 to 1"
                    defaultValue={pvalue.current}
                    onChange={checkPvalue}
                    sx={{maxWidth: "80px"}}
                />
                <Divider/>
            </Stack>
            <OneItemCenter>
                <ResultTable data={result.current}/>
            </OneItemCenter>
        </Stack>
    )
}

export default CellDistributionTab;