import {useEffect, useRef, useState} from "react";
import NumberInput, {inRangeFloat} from "../../NumberInput";
import axios from "axios";
import {runSpatialAutoCorr} from "../../../data/post";
import Selector from "../../Selector";
import RunButton from "./RunAnalysisButton";
import Typography from "@mui/material/Typography";
import VirtualizedAutoComplete from "../../VirtualizedAutoComplete";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import ParamWrap from "../../ParamWrap";
import OneItemCenter from "../../OneItemCenter";


const SpatialAutocorrTab = ({roiID, recordData, cellData, getNeighbors, getExpData}) => {

    const pvalue = useRef(0.05);
    const neighborsData = getNeighbors();

    const [method, setMethod] = useState("geary_c");
    const [result, setResult] = useState(0);
    const [errorPvalue, setErrorPvalue] = useState(false);
    const [raiseRunError, setRaiseRunError] = useState(false);

    const [marker, setMarker] = useState(recordData.markers[0]);
    const {data: expData} = getExpData(roiID, marker);

    useEffect(() => {
        setResult(0);
    }, [cellData]);

    const changeMarker = (e, v) => setMarker(v);

    const handleMethodSelect = (e) => {
        setMethod(e.target.value)
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
        if (errorPvalue) {
            setRaiseRunError(true);
        } else {
            const body = {
                neighbors_map: neighborsData.map,
                expression: expData.expression,
                pvalue: parseFloat(pvalue.current),
                method: method
            }

            axios.post(runSpatialAutoCorr, body).then((res) => {
                setResult(res.data);
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
                minWidth: "200px",
                minHeight: "350px"
            }} spacing={2}>
                <Typography
                    variant="subtitle2">{"Correlation between expression and nearby spatial location"}</Typography>
                <Divider/>
                <VirtualizedAutoComplete
                    options={recordData.markers}
                    label={'Select marker'}
                    value={marker}
                    onChange={changeMarker}
                    sx={{width: "200px"}}
                />
                <Divider/>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Selector title="Method" value={method} onChange={handleMethodSelect} items={{
                        'geary_c': 'Geary\'s C',
                        'moran_i': 'Moran\'s I',
                    }}/>
                    <RunButton onClick={handleRun} onTipOpen={raiseRunError}
                               onTipClose={() => setRaiseRunError(false)}/>
                </Stack>
                <Divider/>
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
                {(result !== 0) ?
                    <>
                        <Typography component="h3" sx={{mt: 2}}>
                            Spatial Autocorrelation: {(result.pattern === 0) ? "✔️" : "❌"}
                        </Typography>
                        <Typography component="h3" sx={{mt: 2}}>
                            Index value: {result.autocorr_value.toFixed(5)}
                        </Typography>
                    </>
                    : <></>}
            </OneItemCenter>
        </Stack>
    )

}

export default SpatialAutocorrTab;