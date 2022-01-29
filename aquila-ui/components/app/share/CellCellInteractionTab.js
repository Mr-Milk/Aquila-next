import {useEffect, useMemo, useRef, useState} from "react";
import Grid from "@mui/material/Grid";
import Selector from "components/Selector";
import NumberInput, {inRangeFloat, inRangeInt} from "components/NumberInput";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import {runCellInterations} from "data/post";
import Heatmap from "components/Viz/Heatmap";
import natsort from "natsort";
import axios from "axios";
import RunBotton from "./RunAnalysisButton";

const patternMap = {'0': 'Non significant', '1': 'Attract', '-1': 'Repeal'}


const processResult = (data) => {

    const size = data.type1.length;

    return [...Array(size).keys()].map((i) => {
        let t1 = data.type1[i];
        let t2 = data.type2[i];
        // let pattern = parseInt(data.pattern[i]);
        // let v = (pattern === 0) ? 0 : data.score[i];
        let v = data.score[i];
        return [t1, t2, v,]// `${t1} - ${t2}`, pattern]
    })
}


const CellCellInteractionTab = ({roiID, cellData, neighborsData}) => {

    const pvalue = useRef(0.05);
    const times = useRef(500);
    const result = useRef({type1: []});
    const labels = useRef([]);

    const [method, setMethod] = useState("pval");
    const [errorTimes, setErrorTimes] = useState(false);
    const [errorPvalue, setErrorPvalue] = useState(false);
    const [raiseRunError, setRaiseRunError] = useState(false);
    const [showViz, setShowViz] = useState(0);

    useMemo(() => {
        if (cellData !== undefined) {
            labels.current = [...new Set(cellData.cell_type)].sort(natsort())
        }
    }, [cellData]);

    useEffect(() => {
        setShowViz(0);
    }, [roiID]);

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

    const checkPvalue = (e) => {
        if (inRangeFloat(e.target.value, 0.0, 1.0, false)) {
            setErrorPvalue(false);
            pvalue.current = e.target.value;
        } else {
            setErrorPvalue(true);
        }
    }

    const handleRun = () => {
        if (errorTimes || errorPvalue) {
            setRaiseRunError(true)
        } else {
            const body = {
                neighbors_map: neighborsData.map,
                cell_type: cellData.cell_type,
                times: parseInt(times.current),
                pvalue: parseFloat(pvalue.current),
                method: method
            }
            console.log(body)
            axios.post(runCellInterations, body).then((res) => {
                result.current = processResult(res.data);
                console.log(result.current)
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
                        'pval': 'Pseudo p-value',
                        'zscore': 'zscore',
                    }}/>
                </Grid>
                <Grid item>
                    <NumberInput
                        label={"Times"}
                        error={errorTimes}
                        helperText="1-1000 Integer"
                        onChange={checkTimes}
                        defaultValue={times.current}
                        description={"How many times to repeat permutation"}
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
                    <RunBotton onClick={handleRun} onTipOpen={raiseRunError} onTipClose={() => setRaiseRunError(false)}/>
                </Grid>
            </Grid>
            <Grid component={"div"} container flexDirection="row" justifyContent="center" alignItems="center">
                <Grid component={"div"} item sx={{mt: 2}}>
                    {
                        showViz ? <Heatmap title="Cell interactions"
                                           data={result.current}
                                           xlabel={labels.current}
                                           ylabel={labels.current}
                                           height={500}
                                           width={500}
                        /> : <></>
                    }
                </Grid>
            </Grid>
        </>
    )

}

export default CellCellInteractionTab;