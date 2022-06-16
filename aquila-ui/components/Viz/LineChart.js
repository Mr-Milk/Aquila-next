import {titleOpts, toolboxOpts} from "components/Viz/config";
import Echarts from "./echarts-obj";

import * as echarts from 'echarts/core';
import {CanvasRenderer} from 'echarts/renderers';
import {LineChart as LChart} from 'echarts/charts';
import {GridComponent, TitleComponent, ToolboxComponent, TooltipComponent} from 'echarts/components';

echarts.use(
    [
        LChart,
        GridComponent,
        ToolboxComponent,
        TooltipComponent,
        TitleComponent,
        CanvasRenderer,
    ]
)

const LineChart = ({data, categories, xdata, title}) => {

    const plotData = data.map((r) => {
        return {
            name: r.name,
            type: 'line',
            data: r.value
        }
    })

    const options = {
        ...titleOpts(title),
        ...toolboxOpts,
        tooltip: {
            trigger: 'axis',
        },
        grid: {
            show: true,
            top: '28%',
            bottom: '5%',
            right: '10%',
            left: '10%',
            containLabel: true,
        },
        legend: {
            data: categories,
            orient: 'horizontal',
            top: '7%',
            itemWidth: 20,
            itemHeight: 12,
            textStyle: {
                fontSize: 11,
                overflow: 'truncate'
            }
        },
        xAxis: {
            type: 'category',
            splitNumber: xdata.length,
            data: xdata,
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
        series: plotData
    }

    return <Echarts
        echarts={echarts}
        option={options}
        style={{minWidth: 500, height: 400}}
    />
}

export default LineChart;