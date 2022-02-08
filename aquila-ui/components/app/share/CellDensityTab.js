import axios from "axios";
import {runCellDensity} from "data/post";
import BarChart from "components/Viz/BarChart";
import {useCallback, useEffect, useRef, useState} from "react";
import Grid from "@mui/material/Grid";
import natsort from "natsort";


const CellDensityTab = ({ cellData, getBBOX }) => {

    const [densityResult, setDensityResult] = useState({x:[], y:[]});

    // const runAnalysis = useCallback((data) => {
    //     if (data === undefined) {
    //         return {}
    //     } else {
    //         const runBody = {
    //             x: data.cell_x,
    //             y: data.cell_y,
    //             cell_type: data.cell_type,
    //         };
    //         axios.post(runCellDensity, runBody).then((res) => {
    //             let result = res.data;
    //             let k = Object.keys(result).sort(natsort());
    //             let v = k.map((i) => result[i]);
    //             densityResult.current = {x: k, y: v};
    //             setShowViz(showViz + 1)
    //         }).catch((e) => console.log(e));
    //     }
    // }, [showViz])

    // do not remove this line, don't give a shit about the IDE
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        const bbox = getBBOX();
        const area = Math.abs((bbox.x2 - bbox.x1) * (bbox.y2 - bbox.y1))
        const counts = {};
        cellData.cell_type.forEach((i) => {
            counts[i] = counts[i] ? counts[i] + 1 : 1;
        })
        const result = {x: [], y: []}
        let keys = Object.keys(counts).sort(natsort());
        keys.map((k) => {
            result.x.push(k)
            result.y.push(counts[k]/area * 1000000)
        });

        setDensityResult(result)
    }, [cellData, getBBOX]);

    return (
        <Grid container flexDirection="row" justifyContent="center">
            <Grid item>
                <BarChart
                    x={densityResult.x}
                    y={densityResult.y}
                    width="450px"
                    height="400px"
                    title="Relative cell density"
                />
            </Grid>
        </Grid>
    )
}

export default CellDensityTab;