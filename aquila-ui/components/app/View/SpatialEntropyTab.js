import useSWR from "swr";
import {fetcher, getCellInfoURL} from "@data/get";
import {useRef, useState} from "react";
import Grid from "@mui/material/Grid";
import Selector from "@components/Selector";
import NumberInput, {isPosInt} from "@components/NumberInput";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import axios from "axios";
import {runCellDistribution, runEntropy, runSpatialEntropy} from "@data/post";
import Typography from "@mui/material/Typography";


const SpatialEntropyTab = ({ roiID }) => {
    const { data: cellData, _ } = useSWR(`${getCellInfoURL}/${roiID}`, fetcher);

    const d = useRef(10);

    const [method, setMethod] = useState("spatial-entropy");
    const [result, setResult] = useState(0);
    const [errorD, setErrorD] = useState(false);
    const [raiseRunError, setRaiseRunError] = useState(false);

    const handleMethodSelect = (e) => {setMethod(e.target.value)};

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
            if (errorD) {setRaiseRunError(true);}
            else {
                const body = {
                    cell_x: cellData.cell_x,
                    cell_y: cellData.cell_y,
                    cell_type: cellData.cell_type,
                    d: parseInt(d.current)
                };
                console.log(body)
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

    if (!cellData) {
        return <></>
    } else {
        return (<>
            <Grid container flexDirection="row" alignItems="center" justifyContent="flex-start" spacing={2}>
                <Grid item>
                    <Selector title="Method" value={method} onChange={handleMethodSelect} items={{
                        'spatial-entropy': 'Spatial Entropy',
                        'entropy': 'Shannon Entropy',
                    }}/>
                </Grid>
                <Grid item style={{display: method === 'spatial-entropy' ? 'block' : 'none'}}>
                    <NumberInput
                        label={"Radius"}
                        error={errorD}
                        helperText="Positive Integer"
                        onChange={checkD}
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
            { (result !== 0) ? <Typography component="h3" sx={{ mt: 2 }}>Entropy is: {result.toFixed(5)}</Typography> : <></>}
        </>)
    }

}

export default SpatialEntropyTab;