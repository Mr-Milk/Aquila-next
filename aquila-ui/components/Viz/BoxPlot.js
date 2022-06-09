import {titleOpts, toolboxOpts} from "components/Viz/config";
import Echarts from "./echarts-obj";

import * as echarts from 'echarts/core';
import {CanvasRenderer} from 'echarts/renderers';
import {BoxplotChart} from 'echarts/charts';
import {
    GridComponent, TitleComponent, TooltipComponent,
    DatasetComponent, TransformComponent
} from 'echarts/components';

echarts.use(
    [
        BoxplotChart,
        GridComponent,
        DatasetComponent,
        TransformComponent,
        TooltipComponent,
        TitleComponent,
        CanvasRenderer,
    ]
)

const BoxPlot = ({data, xlabel, title}) => {

    const options = {
        ...titleOpts(title),
        ...toolboxOpts,
        tooltip: {
            trigger: 'item',
        },
        grid: {
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            axisTick: {
                alignWithLabel: true,
            },
            axisLabel: {
                interval: 0,
                rotate: 45,
                fontSize: 12,
            },
            nameRotate: 30,
            nameGap: 30,
        },
        yAxis: {
            type: 'value',
        },
        dataset: [
            {
                source: data
            },
            {
                transform: {
                    type: 'boxplot',
                    print: true,
                    config: {itemNameFormatter: (params) => xlabel[params.value]}
                }
            },
            {
                fromDatasetIndex: 1,
                fromTransformResult: 1
            }
        ],
        series: [
            {
                name: 'boxplot',
                type: 'boxplot',
                datasetIndex: 1
            },
            {
                name: 'outlier',
                type: 'scatter',
                datasetIndex: 2,
                symbolSize: 5,
                symbol: 'diamond',
            }
        ]
    }

    return <Echarts
        echarts={echarts}
        option={options}
        style={{minWidth: 500, height: 500}}
    />
}

export default BoxPlot;