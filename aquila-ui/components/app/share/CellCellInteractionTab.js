import {useEffect, useMemo, useRef, useState} from "react";
import Selector from "components/Selector";
import NumberInput, {inRangeFloat, inRangeInt} from "components/NumberInput";
import {runCellInterations} from "data/post";
import Heatmap from "components/Viz/Heatmap";
import natsort from "natsort";
import axios from "axios";
import RunButton from "./RunAnalysisButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ParamWrap from "../../ParamWrap";
import Ranger from "../../Ranger";
import OneItemCenter from "../../OneItemCenter";

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
    const result = useRef({type1: []});
    const labels = useRef([]);

    const [method, setMethod] = useState("pval");
    const [times, setTimes] = useState(500);
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
                times: parseInt(times),
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
        return null
    }

    return (
        <Stack direction="row">
            <Stack sx={{
                borderRight: 1, borderColor: "divider", pr: 2,
                minWidth: "280px",
                minHeight: "350px"
            }} spacing={2}>
                <Typography variant="subtitle2">{"Spatial interation between cells"}</Typography>
                <Divider/>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Selector title="Method" value={method} onChange={handleMethodSelect} items={{
                        'pval': 'Pseudo p-value',
                        'zscore': 'zscore',
                    }}/>
                    <RunButton onClick={handleRun} onTipOpen={raiseRunError}
                               onTipClose={() => setRaiseRunError(false)}/>
                </Stack>
                <Divider/>
                <ParamWrap>
                    <Ranger value={times} min={500} max={2000} step={100} onChange={(_, v) => setTimes(v)}
                            title={"Repeat"} description={"How many times to repeat permutation"}/>
                </ParamWrap>
                <ParamWrap>
                    <NumberInput
                        label={"p value"}
                        error={errorPvalue}
                        helperText="Number between 0 to 1"
                        defaultValue={pvalue.current}
                        onChange={checkPvalue}
                        sx={{maxWidth: "80px"}}
                    />
                </ParamWrap>
            </Stack>
            <OneItemCenter>
                {
                    showViz ? <Heatmap title="Cell interactions"
                                       data={result.current}
                                       xlabel={labels.current}
                                       ylabel={labels.current}
                                       height={500}
                                       width={500}
                    /> : <></>
                }
            </OneItemCenter>
        </Stack>
    )

}

export default CellCellInteractionTab;