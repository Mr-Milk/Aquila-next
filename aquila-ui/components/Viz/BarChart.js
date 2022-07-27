import {titleOpts, toolboxOpts} from "components/Viz/config";
import Echarts from "./echarts-obj";

import * as echarts from 'echarts/core';
import {CanvasRenderer} from 'echarts/renderers';
import {BarChart as BChart} from 'echarts/charts';
import {GridComponent, TitleComponent, TooltipComponent, ToolboxComponent} from 'echarts/components';

echarts.use(
    [
        BChart,
        GridComponent,
        TooltipComponent,
        ToolboxComponent,
        TitleComponent,
        CanvasRenderer,
    ]
)

const BarChart = ({labels, values, title, flipXY=false}) => {

    //const [x, y] = flipXY ? [labels, values] : [values, labels];
    const catAxis = {
            type: 'category',
            data: labels,
            splitNumber: labels.length,
            axisTick: {
                alignWithLabel: true,
            },
            axisLabel: {
                interval: 0,
                rotate: 45,
                fontSize: labels.length < 15 ? 12 : 10,
            },
            nameRotate: 30,
            nameGap: 30,
        };
    const valueAxis = {
            type: 'value',
        };

    const options = {
        ...titleOpts(title),
        ...toolboxOpts,
        tooltip: {
            trigger: 'item',
        },
        grid: {
            containLabel: true,
        },
        yAxis: flipXY ? catAxis : valueAxis,
        xAxis: flipXY ? valueAxis : catAxis,
        series: [
            {
                data: values,
                type: 'bar',
            }
        ]
    }

    return <Echarts
        echarts={echarts}
        option={options}
        style={{minWidth: 600, height: 600}}
    />
}

export default BarChart;