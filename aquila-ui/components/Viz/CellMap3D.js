import Echarts from "./echarts-obj";
import * as echarts from 'echarts/core';
import { VisualMapComponent } from 'echarts/components';
import 'echarts-gl';
import {CAT_COLORS, titleOpts} from "./config";

echarts.use([
    VisualMapComponent
])

const CellMap3D = ({ cx, cy, cz, ct, symbolSize, canvasSize }) => {

    let hasCellType = (ct !== undefined);
    if (hasCellType && (ct.length === 0)) { hasCellType = false }
    const categories = hasCellType ? [...new Set(ct)] : ['unknown'];
    const pieces = categories.map((c, i) => {
        return {
            value: c,
            label: c,
            color: CAT_COLORS[i]
        }
    })

    const renderData = cx.map((d, i) => {
        return {
            value: [d, cy[i], cz[i], hasCellType ? ct[i] : "unknown"],
        }
    })

    const axisOptions = {
        axisTick: {show: false},
        splitLine: {show: false},
        axisPointer: {show: false},
        axisLabel: {show: false}
    }

    const options = {
        ...titleOpts("3D Cell Map"),
        visualMap: {
            type: "piecewise",
            top: 'middle',
            // categories: categories,
            min: 0,
            max: categories.length,
            left: 0,
            splitNumber: categories.length,
            dimension: 3,
            pieces: pieces,
            itemSymbol: 'circle',
            itemHeight: 10,
            textGap: 5,
            textStyle: {
                width: 5,
                fontSize: 12,
                overflow: 'breakAll'
            }
        },
        grid3D: {
            top: 'middle'
        },
        xAxis3D: {...axisOptions},
        yAxis3D: {...axisOptions},
        zAxis3D: {...axisOptions},
        series: [
            {
                type: 'scatter3D',
                symbolSize: symbolSize,
                data: renderData
            }
        ]

    }

    return <Echarts echarts={echarts} option={options} style={{ height: canvasSize, width: canvasSize }}/>
}

export default CellMap3D;