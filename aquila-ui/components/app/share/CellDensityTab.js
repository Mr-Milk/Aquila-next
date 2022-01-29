import axios from "axios";
import {runCellDensity} from "data/post";
import BarChart from "components/Viz/BarChart";
import {useCallback, useEffect, useRef, useState} from "react";
import Grid from "@mui/material/Grid";
import natsort from "natsort";


const CellDensityTab = ({ cellData }) => {

    const [showViz, setShowViz] = useState(0);
    let densityResult = useRef({x: [], y: []});

    const runAnalysis = useCallback((data) => {
        if (data === undefined) {
            return {}
        } else {
            const runBody = {
                x: data.cell_x,
                y: data.cell_y,
                cell_type: data.cell_type,
            };
            axios.post(runCellDensity, runBody).then((res) => {
                let result = res.data;
                let k = Object.keys(result).sort(natsort());
                let v = k.map((i) => result[i]);
                densityResult.current = {x: k, y: v};
                setShowViz(showViz + 1)
            }).catch((e) => console.log(e));
        }
    }, [showViz])

    // do not remove this line, don't give a shit about the IDE
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        runAnalysis(cellData)
    }, [cellData]);

    return (
        <Grid container flexDirection="row" justifyContent="center">
            <Grid item>
                <BarChart
                    x={densityResult.current.x}
                    y={densityResult.current.y}
                    width="450px"
                    height="400px"
                    title="Relative cell density"
                />
            </Grid>
        </Grid>
    )
}

export default CellDensityTab;