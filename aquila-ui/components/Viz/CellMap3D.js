import Echarts from "./echarts-obj";
import * as echarts from 'echarts/core';
import {LegendComponent, ToolboxComponent, VisualMapComponent} from 'echarts/components';
import {CAT_COLORS, ThumbNailSize, titleOpts, toolboxOpts, axis3DOptions} from "./config";
import 'echarts-gl';

echarts.use([
    VisualMapComponent,
    LegendComponent,
    ToolboxComponent
])

const getSeries = (cx, cy, cz, ct, symbolSize) => {
    let hasCellType = (ct !== undefined);
    if (hasCellType && (ct.length === 0)) {
        hasCellType = false
    }
    const categories = hasCellType ? [...new Set(ct)] : ['unknown'];

    const series = {}
    categories.forEach((c) => {
        series[c] = {
            name: c,
            type: 'scatter3D',
            symbolSize: symbolSize,
            label: {formatter: ''},
            data: []
        }
    })

    cx.map((x, i) => {
        let y = cy[i];
        let z = cz[i];
        let t = hasCellType ? ct[i] : "unknown";
        series[t].data.push(
            [x, y, z]
        )
    })

    return series
}

export const CellMap3DThumbNail = ({cx, cy, cz, ct}) => {

    const dataSize = cx.length;
    const symbolSize = dataSize < 5000 ? 2 : ( dataSize < 10000 ? 1 : 0.5);
    const series = getSeries(cx, cy, cz, ct, symbolSize);

    const options = {
        color: CAT_COLORS,
        grid3D: {
            show: false,
            top: 'middle',
        },
        xAxis3D: {name: '', ...axis3DOptions},
        yAxis3D: {name: '', ...axis3DOptions},
        zAxis3D: {name: '', ...axis3DOptions},
        series: Object.values(series)

    }

    return <Echarts echarts={echarts} option={options} style={{height: ThumbNailSize, width: ThumbNailSize}}/>
}


export const CellMap3D = ({cx, cy, cz, ct, symbolSize, canvasSize}) => {

    const series = getSeries(cx, cy, cz, ct, symbolSize);

    const options = {
        color: CAT_COLORS,
        ...titleOpts("3D Cell Map"),
        ...toolboxOpts,
        legend: {
            type: "scroll",
            align: "left",
            left: '75%',
            right: 0,
            top: 'middle',
            // itemSymbol: "circle",
            orient: "vertical",
            itemHeight: 10,
            itemStyle: {
                borderWidth: 0
            },
            textGap: 5,
            // borderWidth: 0,
            textStyle: {
                fontSize: 12,
                overflow: 'truncate'
            },
            // formatter: function (name) {
            //     return echarts.format.truncateText(name, 200, '14px Microsoft Yahei', '…');
            // },
            // tooltip: {
            //     show: true
            // }
        },
        grid3D: {
            top: 'middle',
        },
        tooltip: {
            position: 'top',
            formatter: '{a}',
        },
        xAxis3D: {...axis3DOptions},
        yAxis3D: {...axis3DOptions},
        zAxis3D: {...axis3DOptions},
        series: Object.values(series)

    }

    return <Echarts echarts={echarts} option={options} style={{height: canvasSize, width: canvasSize}}/>
}