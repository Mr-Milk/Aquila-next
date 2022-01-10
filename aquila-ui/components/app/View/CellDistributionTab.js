import useSWR from "swr";
import {fetcher, getCellInfoURL} from "@/data/get";
import axios from "axios";
import {runCellDistribution} from "@/data/post";
import Grid from "@mui/material/Grid";
import Selector from "@/components/Selector";
import {useRef, useState} from "react";
import NumberInput, {inRangeFloat, inRangeInt, isPosFloat, isPosInt} from "@/components/NumberInput";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import natsort from "natsort";


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
                            [...Array(size).keys()].map((i) => (
                                <TableRow key={i}>
                                    <TableCell>{data.cell_type[i]}</TableCell>
                                    <TableCell>{patternMap[data.pattern[i]]}</TableCell>
                                    <TableCell>{displayIxValue(data.ix_value[i])}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }


}


const CellDistributionTab = ({roiID}) => {
    const {data: cellData, _} = useSWR(`${getCellInfoURL}/${roiID}`, fetcher);

    const r = useRef(10);
    const times = useRef(500);
    const quad = useRef([10, 10]);
    const rect = useRef([10, 10]);
    const pvalue = useRef(0.05);
    const result = useRef({cell_type: [], ix_value: [], pattern: []});

    const [method, setMethod] = useState("id");
    const [errorTimes, setErrorTimes] = useState(false);
    const [errorR, setErrorR] = useState(false);
    const [errorQuad, setErrorQuad] = useState(false);
    const [errorRect, setErrorRect] = useState(false);
    const [errorPvalue, setErrorPvalue] = useState(false);
    const [raiseRunError, setRaiseRunError] = useState(false);
    const [showResult, setShowResult] = useState(0);

    const handleMethodSelect = (e) => {
        setMethod(e.target.value)
    };

    const checkTimes = (e) => {
        if (!inRangeInt(e.target.value, 1, 1000)) {
            setErrorTimes(true)
        } else {
            setErrorTimes(false);
            times.current = e.target.value;
        }
    };
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
        if ((method === "id") && (errorR || errorTimes)) {
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
                times.current,
                quad.current,
            );
            axios.post(runCellDistribution, body).then((res) => {
                result.current = res.data;
                setShowResult(showResult + 1)
            }).catch((e) => console.log(e))
        }
    }

    if (cellData === undefined) {
        return <></>
    } else {
        return (
            <>
                <Grid container flexDirection="row" alignItems="center" justifyContent="flex-start" spacing={2}>
                    <Grid item>
                        <Selector title="Method" value={method} onChange={handleMethodSelect} items={{
                            'id': 'Index of Dispersion (Random sampling)',
                            'morisita': 'Morisita Index (Quadratic statistic)',
                            'clark-evans': 'Clark-Evans Index (Nearest Neighbors based)',
                        }} sx={{maxWidth: '150px'}}/>
                    </Grid>
                    <Grid item style={{display: method === 'id' ? 'block' : 'none'}}>
                        <NumberInput
                            label={"Radius"}
                            error={errorR}
                            helperText="Positive number"
                            onChange={checkR}
                            sx={{maxWidth: "80px"}}
                        />
                    </Grid>
                    <Grid item style={{display: method === 'id' ? 'block' : 'none'}}>
                        <NumberInput
                            label={"Repeat"}
                            error={errorTimes}
                            helperText="1-1000 Integer"
                            onChange={checkTimes}
                            sx={{maxWidth: "80px"}}
                        />
                    </Grid>

                    <Grid item style={{display: method === 'morisita' ? 'block' : 'none'}}>
                        <NumberInput
                            label={"Quadrat"}
                            error={errorQuad}
                            helperText="eg. 10,10"
                            useNumber={false}
                            onChange={checkQuad}
                            sx={{maxWidth: "80px"}}
                        />
                    </Grid>
                    <Grid item>
                        <NumberInput
                            label={"p value"}
                            error={errorPvalue}
                            helperText="Number between 0 to 1"
                            defaultValue={pvalue.current}
                            onChange={checkPvalue}
                            sx={{maxWidth: "80px"}}
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
                        <ResultTable data={result.current}/>
                    </Grid>
                </Grid>
            </>
        )
    }
}

export default CellDistributionTab;