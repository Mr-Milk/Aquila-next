import useSWR from "swr";
import {fetcher, getCellInfoURL} from "data/get";
import axios from "axios";
import {runCellDensity} from "data/post";
import BarChart from "components/Viz/BarChart";
import {useEffect, useRef} from "react";
import Grid from "@mui/material/Grid";
import natsort from "natsort";

const sorter = natsort();

const CellDensityTab = ({roiID}) => {

    const {data: cellData, _} = useSWR(`${getCellInfoURL}/${roiID}`, fetcher);
    let densityResult = useRef({x: [], y: []});

    const runAnalysis = (data) => {
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
            }).catch((e) => console.log(e));
            console.log("Get density for once");
        }
    }

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