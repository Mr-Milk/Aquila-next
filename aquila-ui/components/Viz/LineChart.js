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

    const height = 400;
    const width = 500;

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
            top: 'middle',
            bottom: '0',
            right: '16%',
            left: '1%',
            width: width,
            height: height,
            containLabel: true,
        },
        legend: {
            type: 'scroll',
            data: categories,
            orient: 'vertical',
            align: "left",
            right: '0%',
            top: 'middle',
            height: '75%',
            itemWidth: 20,
            itemHeight: 10,
            textStyle: {
                fontSize: 11,
                overflow: 'truncate'
            },
            formatter: function (name) {
                return echarts.format.truncateText(name, 150, '14px Microsoft Yahei', '…');
            },
            tooltip: {
                show: true
            },
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
        style={{minWidth: width + 150, height: height + 50}}
    />
}

export default LineChart;