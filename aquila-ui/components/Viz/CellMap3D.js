import Echarts from "./echarts-obj";
import * as echarts from 'echarts/core';
import {VisualMapComponent, LegendComponent, ToolboxComponent} from 'echarts/components';
import 'echarts-gl';
import {CAT_COLORS, titleOpts, toolboxOpts} from "./config";

echarts.use([
    VisualMapComponent,
    LegendComponent,
    ToolboxComponent
])

const CellMap3D = ({cx, cy, cz, ct, symbolSize, canvasSize}) => {

    let hasCellType = (ct !== undefined);
    if (hasCellType && (ct.length === 0)) {
        hasCellType = false
    }
    const categories = hasCellType ? [...new Set(ct)] : ['unknown'];
    // const pieces = categories.map((c, i) => {
    //     return {
    //         value: c,
    //         label: c,
    //         color: CAT_COLORS[i]
    //     }
    // })

    // const renderData = cx.map((d, i) => {
    //     return {
    //         value: [d, cy[i], cz[i], hasCellType ? ct[i] : "unknown"],
    //     }
    // })

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

    const axisOptions = {
        axisTick: {show: false},
        splitLine: {show: false},
        axisPointer: {show: false},
        axisLabel: {show: false}
    }

    const options = {
        ...titleOpts("3D Cell Map"),
        ...toolboxOpts,
        // visualMap: {
        //     type: "piecewise",
        //     top: 'middle',
        //     // categories: categories,
        //     min: 0,
        //     max: categories.length,
        //     left: 0,
        //     splitNumber: categories.length,
        //     dimension: 3,
        //     pieces: pieces,
        //     itemSymbol: 'circle',
        //     itemHeight: 10,
        //     textGap: 5,
        //     textStyle: {
        //         width: 5,
        //         fontSize: 12,
        //         overflow: 'breakAll'
        //     }
        // },
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
        xAxis3D: {...axisOptions},
        yAxis3D: {...axisOptions},
        zAxis3D: {...axisOptions},
        series: Object.values(series)

    }

    return <Echarts echarts={echarts} option={options} style={{height: canvasSize, width: canvasSize}}/>
}

export default CellMap3D;