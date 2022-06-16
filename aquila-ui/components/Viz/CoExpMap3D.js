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
import {mixingColors} from "./CoExpMap2D";
import {axis3DOptions} from "./config";
import dynamic from "next/dynamic";

dynamic(
    () => {
        import('echarts-gl/charts').then(
            (mod) => echarts.use([mod.Scatter3DChart])
        );
        import('echarts-gl/components').then(
            (mod) => echarts.use([mod.Grid3DComponent])
        );
    },
    {ssr: false})

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

export const CoExpMap3D = ({cx, cy, cz, exp, symbolSize, canvasSize, ...leftProps}) => {
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
            value: [x, cy[i], cz[i]],
            itemStyle: {
                color: renderColors[i],
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
        grid3D: {
            top: 'middle',
        },
        xAxis3D: {...axis3DOptions},
        yAxis3D: {...axis3DOptions},
        zAxis3D: {...axis3DOptions},
        series: [
            {
                type: "scatter3D",
                symbolSize: symbolSize,
                data: renderData,
            },
        ],
    };

    return (
        <Echarts
            echarts={echarts}
            option={options}
            style={{height: canvasSize, width: canvasSize}}
        />
    )
}