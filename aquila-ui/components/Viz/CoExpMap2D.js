import max from "loadsh/max"
import min from "loadsh/min"
import Echarts from "./echarts-obj";

import chroma from "chroma-js";
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
    VisualMapContinuousComponent,
} from 'echarts/components';
import 'echarts-gl';

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


export const mixingColors = (colors) => {
    const [colorsCount, expCount] = [colors[0].length, colors.length];
    const mixture = [];
    for (let i = 0; i < colorsCount; i++) {
        let cellColors = [];
        let recordColors = [];
        for (let k = 0; k < expCount; k++) {
            let c = colors[k][i];
            // if the value is 0, the color will not be added
            if (c.value !== 0) {
                cellColors.push(c.color)
            }
            recordColors.push(c.color)
        }
        // if all color is zero, return arbitrary color map to the scale
        if (cellColors.length === 0) {
            mixture.push(recordColors[0].hex())
        } else if (cellColors.length === 1) {
            mixture.push(cellColors[0].hex())
        } else {
            // if more than two colors, average them
            mixture.push(chroma.average(cellColors).hex())
        }
    }
    return mixture;
};

export const CoExpMap2D = ({cx, cy, exp, symbolSize, canvasSize, ...leftProps}) => {
    const dataSize = cx.length;
    const colors = []
    const labels = cx.map(() => [])
    const renderTitle = []
    const renderTitleRich = {}
    exp.map((e) => {
        let values = e.values;
        let min_v = min(values);
        let max_v = max(values);
        let scaler = chroma.scale(e.cmap).domain([min_v, max_v]);
        let expColor = chroma.scale(e.cmap)(1).alpha(0.7).hex();
        colors.push(values.map((v, i) => {
            labels[i].push(`<span style="color: ${expColor}"><b>${e.name}</b>: ${v}</span><br>`)
            return {value: v, color: scaler(v)}
        }))
        renderTitle.push(`{${e.cmap}|${e.name}}`)
        renderTitleRich[e.cmap] = {
            color: expColor,
            fontSize: 12,
            fontWeight: 'bold',
        }
    })
    const renderColors = mixingColors(colors);
    const renderData = cx.map((x, i) => {
        return {
            name: labels[i].join(""),
            value: [x, cy[i]],
            itemStyle: {
                color: renderColors[i],
                borderColor: '#555',
                borderWidth: 0,//(symbolSize < 3) ? 0 : 0.5,
            }
        }
    });

    const options = {
        toolbox: {
            itemSize: 13,
            right: '10%',
            feature: {
                saveAsImage: {
                    show: true,
                    title: 'Save',
                },
            },
        },
        tooltip: {
            formatter: (params) => params.name
        },
        title: {
            text: renderTitle.join(" "),
            left: "0%",
            top: "0%",
            textStyle: {
                rich: renderTitleRich
            }
        },
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
        grid: {
            show: true,
            top: 'middle',
            width: canvasSize,
            height: canvasSize,
            containLabel: true,
            left: '0%',
            right: '0%',
        },
        xAxis: {show: false, scale: true, axisLabel: {show: false}, axisTick: {show: false}},
        yAxis: {show: false, scale: true, axisLabel: {show: false}, axisTick: {show: false}},
        series: [
            {
                type: dataSize < 15000 ? "scatter" : "scatterGL",
                symbolSize: symbolSize,
                data: renderData,
            },
        ],
    };

    return (
        <Echarts
            echarts={echarts}
            option={options}
            style={{height: canvasSize + 50, width: canvasSize + 50}}
        />
    )
}