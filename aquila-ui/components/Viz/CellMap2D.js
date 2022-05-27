import Echarts from "./echarts-obj";
import 'echarts-gl';
import * as echarts from 'echarts/core';
import {CanvasRenderer} from 'echarts/renderers';
import {ScatterChart} from 'echarts/charts';
import {
    DataZoomComponent,
    GridComponent,
    LegendComponent,
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    VisualMapComponent,
    VisualMapContinuousComponent
} from 'echarts/components';
import {CAT_COLORS, toolboxOpts} from "./config";

echarts.use([
    CanvasRenderer,
    ScatterChart,
    DataZoomComponent,
    GridComponent,
    LegendComponent,
    TitleComponent,
    TooltipComponent,
    ToolboxComponent,
    VisualMapComponent,
    VisualMapContinuousComponent
])


const CellMap2D = ({cx, cy, ct, symbolSize, canvasSize}) => {

    let hasCellType = (ct !== undefined);
    if (hasCellType && (ct.length === 0)) {
        hasCellType = false
    }
    const dataSize = cx.length;
    const categories = hasCellType ? [...new Set(ct)] : ['unknown'];
    // const pieces = categories.map((c, i) => {
    //     return {
    //         value: c,
    //         label: c,
    //         color: CAT_COLORS[i]
    //     }
    // })

    const chartType = dataSize < 15000 ? 'scatter' : 'scatterGL'
    const borderWidth = (symbolSize < 3) ? 0 : 0.5
    const series = {}
    categories.forEach((c) => {
        series[c] = {
            name: c,
            type: chartType,
            symbolSize: symbolSize,
            encode: {tooltip: [2]},
            itemStyle: {
                borderColor: '#555',
                borderWidth: borderWidth,
            },
            data: []
        }
    })

    cx.map((x, i) => {
        let y = cy[i];
        let t = hasCellType ? ct[i] : "unknown";
        series[t].data.push(
            [x, y]
        )
    })

    // const renderData = cx.map((x, i) => {
    //     return [x, cy[i], hasCellType ? ct[i] : "unknown"]
    // })

    const option = {
        title: {
            text: 'Cell Map',
            left: "33%",
            top: "0%",
            textStyle: {
                fontSize: 14,
            },
        },
        toolbox: {
            itemSize: 13,
            right: '5%',
            feature: {
                saveAsImage: {
                    show: true,
                    title: 'Save',
                },
                dataZoom: {}
            }
        },
        // visualMap: {
        //     type: "piecewise",
        //     top: 'middle',
        //     align: 'left',
        //     // categories: categories,
        //     min: 0,
        //     max: categories.length,
        //     left: '75%',
        //     right: 0,
        //     splitNumber: categories.length,
        //     dimension: 2,
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
            top: 'middle',
            // itemSymbol: "circle",
            orient: "vertical",
            itemHeight: 10,
            itemStyle: {
                borderWidth: 0
            },
            textGap: 5,
            formatter: function (name) {
                return echarts.format.truncateText(name, 150, '14px Microsoft Yahei', '…');
            },
            tooltip: {
                show: true
            }
            // borderWidth: 0,
            // textStyle: {
            //     width: 5,
            //     fontSize: 12,
            //     overflow: 'breakAll'
            // }
        },
        // allow zoom x-y at the same ratio
        dataZoom: [
            {
                type: 'inside',
                xAxisIndex: [0]
            },
            {
                type: 'inside',
                yAxisIndex: [0],
            },
        ],
        tooltip: {
            position: 'top',
            formatter: '{a}',
        },
        // To maintain the x-y at same ratio
        grid: {
            show: false,
            top: 'middle',
            width: canvasSize,
            height: canvasSize,
            containLabel: true,
            left: '0%',
            right: '15%'
        },
        xAxis: {show: false, scale: false, axisLabel: {show: false}, axisTick: {show: false}},
        yAxis: {show: false, scale: false, axisLabel: {show: false}, axisTick: {show: false}},
        // series: {
        //     type: dataSize < 15000 ? 'scatter' : 'scatterGL',
        //     symbolSize: symbolSize,
        //     encode: {tooltip: [2]},
        //     itemStyle: {
        //         borderColor: '#555',
        //         borderWidth: (symbolSize < 3) ? 0 : 0.5,
        //     },
        //     data: renderData
        // }
        series: Object.values(series)
    }

    return <Echarts
        echarts={echarts} option={option} style={{height: canvasSize + 50, width: canvasSize + 150}}/>
}

export default CellMap2D;