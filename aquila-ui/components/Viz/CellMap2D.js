import Echarts from "./echarts-obj";
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
import {CAT_COLORS, titleOpts} from "./config";

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
    if (hasCellType && (ct.length === 0)) { hasCellType = false }
    const categories = hasCellType ? [...new Set(ct)] : ['unknown'];
    const pieces = categories.map((c, i) => {
        return {
            value: c,
            label: c,
            color: CAT_COLORS[i]
        }
    })

    const renderData = cx.map((x, i) => {
        return [x, cy[i], hasCellType ? ct[i] : "unknown"]
    })

    const option = {
        ...titleOpts("Cell Map"),
        visualMap: {
            type: "piecewise",
            top: 'middle',
            // categories: categories,
            min: 0,
            max: categories.length,
            left: 0,
            splitNumber: categories.length,
            dimension: 2,
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
            position: 'top'
        },
        // To maintain the x-y at same ratio
        grid: {
            top: 'middle',
            width: canvasSize,
            height: canvasSize,
            containLabel: true,
        },
        xAxis: {show: false, scale: false},
        yAxis: {show: false, scale: false},
        series: {
            type: 'scatter',
            symbolSize: symbolSize,
            encode: {tooltip: [2]},
            itemStyle: {
                borderColor: '#555',
                borderWidth: 0.5
            },
            data: renderData
        }
    }

    return <Echarts
        echarts={echarts} option={option} style={{height: canvasSize+100, width: canvasSize+100}}/>
}

export default CellMap2D;