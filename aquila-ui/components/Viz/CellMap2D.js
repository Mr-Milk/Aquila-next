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
import {CAT_COLORS, ThumbNailSize, toolboxOpts} from "./config";

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

const getSeries = (cx, cy, ct, symbolSize) => {

    let hasCellType = (ct !== undefined);
    if (hasCellType && (ct.length === 0)) {
        hasCellType = false
    }
    const dataSize = cx.length;
    if (!symbolSize) {
        symbolSize = dataSize < 5000 ? 2 : 1;
    }
    const categories = hasCellType ? [...new Set(ct)] : ['unknown'];

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

    return Object.values(series)
}

const getSeriesTN = (cx, cy, ct) => {

    let hasCellType = (ct !== undefined);
    if (hasCellType && (ct.length === 0)) {
        hasCellType = false
    }
    const dataSize = cx.length;
    const symbolSize = dataSize < 5000 ? 2 : 1;
    const categories = hasCellType ? [...new Set(ct)] : ['unknown'];

    const chartType = dataSize < 15000 ? 'scatter' : 'scatterGL'
    const series = {}
    categories.forEach((c) => {
        series[c] = {
            name: c,
            type: chartType,
            symbolSize: symbolSize,
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

    return Object.values(series)
}

export const CellMap2DThumbNail = ({cx, cy, ct}) => {
    const series = getSeriesTN(cx, cy, ct)
    // console.log('cell map TN', series.map((s) =>  s.name ))
    const option = {
        color: CAT_COLORS,
        // To maintain the x-y at same ratio
        grid: {
            show: true,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: ThumbNailSize,
            height: ThumbNailSize,
            containLabel: true,
        },
        xAxis: {show: false, scale: false, axisLabel: {show: false}, axisTick: {show: false}},
        yAxis: {show: false, scale: false, axisLabel: {show: false}, axisTick: {show: false}},
        series: series
    }

    return <Echarts
        echarts={echarts}
        option={option}
        notMerge={true}
        style={{height: ThumbNailSize, width: ThumbNailSize}}
    />
}

export const CellMap2D = ({cx, cy, ct, symbolSize, canvasSize}) => {

    const series = getSeries(cx, cy, ct, symbolSize)
    // console.log('cell map', series.map((s) =>  s.name ))
    const option = {
        color: CAT_COLORS,
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
            right: '25%',
            feature: {
                saveAsImage: {
                    show: true,
                    title: 'Save',
                },
                dataZoom: {}
            }
        },
        legend: {
            type: "scroll",
            align: "left",
            right: '0%',
            top: 'middle',
            height: '75%',
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
            },
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
        series: series
    }

    return <Echarts
        echarts={echarts}
        option={option}
        notMerge={true}
        style={{height: canvasSize + 50, width: canvasSize + 150}}
    />
}