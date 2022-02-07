import {useRef, useState} from "react";
import Grid from "@mui/material/Grid";
import Selector from "../../Selector";
import NumberInput, {inRangeFloat} from "../../NumberInput";
import RunBotton from "../share/RunAnalysisButton";
import axios from "axios";
import {runSpatialCoexpDB} from "data/post";
import Graph from "../../Viz/Graph";


const SpatialCoExpTab = ({ roiID, getNeighbors }) => {

    const neighborsData = getNeighbors();

    const thresh = useRef(0.7);

    const [method, setMethod] = useState("pearson");
    const [errorThresh, setErrorThresh] = useState(false);
    const [raiseRunError, setRaiseRunError] = useState(false);
    const [showViz, setShowViz] = useState(0);

    const handleMethodSelect = (e) => setMethod(e.target.value);
    const checkThresh = (e) => {
        if (inRangeFloat(e.target.value, 0.0, 1.0, false)) {
            setErrorThresh(false);
            thresh.current = e.target.value;
        } else {
            setErrorThresh(true);
        }
    }

    const handleRun = () => {
        if (errorThresh) {
            setRaiseRunError(true)
        } else {
            const body = {
                neighbors_pairs1: neighborsData.p1,
                neighbors_pairs2: neighborsData.p2,
                roi_id: roiID,
                threshold: parseFloat(thresh.current),
                method: method
            }
            console.log(body)
            axios.post(runSpatialCoexpDB, body).then((res) => {
                result.current = res.data;
                console.log(result.current)
                setShowViz(showViz + 1)
            }).catch((e) => console.log(e))
        }
    }

    return (

        <Grid container flexDirection="row" alignItems="center" justifyContent="flex-start" spacing={2}>
            <Grid item>
                <Selector title="Method" value={method} onChange={handleMethodSelect} items={{
                    'pearson': 'Pearson',
                    'spearman': 'Spearman',
                }} sx={{maxWidth: '150px'}}/>
            </Grid>
            <Grid item>
                <NumberInput
                            label={"Threshold"}
                            error={errorThresh}
                            helperText="Number between 0 to 1"
                            defaultValue={thresh.current}
                            onChange={checkThresh}
                            description={"A number that specify the threshold of correlation, if you specify" +
                                "0.9, pairs in (-1, -0.9) and (0.9, 1) with be saved."}
                            sx={{maxWidth: "80px"}}
                        />
            </Grid>
            <Grid item>
                <RunBotton onClick={handleRun} onTipOpen={raiseRunError} onTipClose={() => setRaiseRunError(false)}/>
            </Grid>
            <Grid component={"div"} container flexDirection="row" justifyContent="center" alignItems="center">
                <Grid component={"div"} item sx={{mt: 2}}>
                    {
                        showViz ? <Graph title="Spatial Co-expression"
                                           height={500}
                                           width={500}
                        /> : <></>
                    }
                </Grid>
            </Grid>
        </Grid>

    )
}

export default SpatialCoExpTab;