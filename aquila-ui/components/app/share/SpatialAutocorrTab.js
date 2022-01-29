import {useRef, useState} from "react";
import NumberInput, {inRangeFloat, isPosInt} from "../../NumberInput";
import axios from "axios";
import {runEntropy, runSpatialAutoCorr} from "../../../data/post";
import Grid from "@mui/material/Grid";
import Selector from "../../Selector";
import RunBotton from "./RunAnalysisButton";
import Typography from "@mui/material/Typography";
import VirtualizedAutoComplete from "../../VirtualizedAutoComplete";


const SpatialAutocorrTab = ({ roiID, recordData, cellData, getNeighbors, getExpData }) => {

    const pvalue = useRef(0.05);
    const neighborsData = getNeighbors();

    const [method, setMethod] = useState("geary_c");
    const [result, setResult] = useState(0);
    const [errorPvalue, setErrorPvalue] = useState(false);
    const [raiseRunError, setRaiseRunError] = useState(false);

    const [marker, setMarker] = useState(recordData.markers[0]);
    const {data: expData} = getExpData(roiID, marker);

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
        if (errorPvalue) { setRaiseRunError(true); }
        else {
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
        return <></>
    } else {
        return (<>
            <Grid container flexDirection="row" alignItems="center" justifyContent="flex-start" spacing={2}>
                <Grid item>
                    <VirtualizedAutoComplete
                    options={recordData.markers}
                    label={'Select marker'}
                    value={marker}
                    onChange={changeMarker}
                    sx={{width: "200px"}}
                />
                </Grid>
                <Grid item>
                    <Selector title="Method" value={method} onChange={handleMethodSelect} items={{
                        'geary_c': 'Geary\'s C',
                        'moran_i': 'Moran\'s I',
                    }}/>
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

        </>)
    }

}

export default SpatialAutocorrTab;