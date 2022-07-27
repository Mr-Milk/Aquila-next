import BarChart from "../../Viz/BarChart";
import {useCallback} from "react";
import natsort from "natsort";
import OneItemCenter from "../../Layout/OneItemCenter";


const bboxSize = (bbox) => {
    let area = Math.abs((bbox.x2 - bbox.x1) * (bbox.y2 - bbox.y1));
    if (Object.hasOwnProperty('z1')) {
        area *= Math.abs((bbox.z1 - bbox.z2))
    }
    return area;
}

const CellDensityTab = ({cellData, bbox}) => {

    const getDensityResult = useCallback(() => {
        const area = Math.abs(bboxSize(bbox))
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
    }, [bbox, cellData.cell_type])

    const result = getDensityResult();
    if (!cellData) {
        return null
    }
    return (
        <OneItemCenter>
            <BarChart
                labels={result.x}
                values={result.y}
                title="Relative cell density"
            />
        </OneItemCenter>
    )
}

export default CellDensityTab;