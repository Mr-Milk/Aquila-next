import {useEffect, useRef, useState} from "react";
import Selector from "components/Selector";
import NumberInput, {isPosInt} from "components/NumberInput";
import axios from "axios";
import {runEntropy, runSpatialEntropy} from "data/post";
import Typography from "@mui/material/Typography";
import RunButton from "./RunAnalysisButton";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import ParamWrap from "../../ParamWrap";
import OneItemCenter from "../../OneItemCenter";


const SpatialEntropyTab = ({cellData}) => {

    const d = useRef(10);

    const [method, setMethod] = useState("spatial-entropy");
    const [result, setResult] = useState(0);
    const [errorD, setErrorD] = useState(false);
    const [raiseRunError, setRaiseRunError] = useState(false);

    useEffect(() => {
        setResult(0);
    }, [cellData]);

    const handleMethodSelect = (e) => {
        setMethod(e.target.value)
    };

    const checkD = (e) => {
        if (!isPosInt(e.target.value)) {
            setErrorD(true);
        } else {
            setErrorD(false);
            d.current = e.target.value;
        }
    }

    const handleRun = () => {
        if (method === "spatial-entropy") {
            if (errorD) {
                setRaiseRunError(true);
            } else {
                const body = {
                    cell_x: cellData.cell_x,
                    cell_y: cellData.cell_y,
                    cell_type: cellData.cell_type,
                    d: parseInt(d.current)
                };
                axios.post(runSpatialEntropy, body).then((res) => {
                    setResult(res.data.entropy);
                }).catch((e) => console.log(e))
            }
        } else {
            const body = {
                cell_type: cellData.cell_type
            }
            axios.post(runEntropy, body).then((res) => {
                setResult(res.data.entropy);
            }).catch((e) => console.log(e))
        }
    }

    if (!cellData) {return null}
    return (
        <Stack direction="row">
            <Stack sx={{
                borderRight: 1, borderColor: "divider", pr: 2,
                minWidth: "250px",
                minHeight: "350px"
            }}
                   spacing={2}>
                <Typography variant="subtitle2">{"Quantify the heterogeneity of ROI"}</Typography>
                <Divider/>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Selector title="Method" value={method} onChange={handleMethodSelect} items={{
                        'spatial-entropy': 'Spatial Entropy',
                        'entropy': 'Shannon Entropy',
                    }} sx={{maxWidth: "150px"}}/>
                    <RunButton onClick={handleRun} onTipOpen={raiseRunError}
                               onTipClose={() => setRaiseRunError(false)}/>
                </Stack>
                <Divider/>
                <ParamWrap show={method === 'spatial-entropy'}>
                    <NumberInput
                        label={"Radius"}
                        error={errorD}
                        helperText="Positive Integer"
                        onChange={checkD}
                        sx={{maxWidth: "80px"}}
                    />
                </ParamWrap>
            </Stack>
            <OneItemCenter>
                {(result !== 0) ?
                    <Typography component="h3" sx={{mt: 2}}>Entropy is: {result.toFixed(5)}</Typography> : <></>}
            </OneItemCenter>
        </Stack>)

}


export default SpatialEntropyTab;