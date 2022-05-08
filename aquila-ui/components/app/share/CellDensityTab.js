import BarChart from "components/Viz/BarChart";
import {useCallback} from "react";
import natsort from "natsort";
import OneItemCenter from "../../Layout/OneItemCenter";


const CellDensityTab = ({cellData, bbox}) => {

    const getDensityResult = useCallback(() => {
        const area = Math.abs((bbox.x2 - bbox.x1) * (bbox.y2 - bbox.y1))
        const counts = {};
        cellData.cell_type.forEach((i) => {
            counts[i] = counts[i] ? counts[i] + 1 : 1;
        })
        const result = {x: [], y: []}
        let keys = Object.keys(counts).sort(natsort());
        keys.map((k) => {
            result.x.push(k)
            result.y.push(counts[k] / area * 1000000)
        });
        return result
    }, [cellData])

    const result = getDensityResult();
    if (!cellData) {
        return null
    }
    return (
        <OneItemCenter>
            <BarChart
                x={result.x}
                y={result.y}
                title="Relative cell density"
            />
        </OneItemCenter>
    )
}

export default CellDensityTab;