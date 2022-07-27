import {CAT_COLORS, titleOpts, toolboxOpts} from "components/Viz/config";
import natsort from "natsort";
import Echarts from "./echarts-obj";
import {counter} from "components/compute/math";

import * as echarts from 'echarts/core';
import {CanvasRenderer} from 'echarts/renderers';
import {PieChart} from 'echarts/charts';
import {GridComponent, LegendComponent, ToolboxComponent, TitleComponent, TooltipComponent} from 'echarts/components';

echarts.use([
    CanvasRenderer,
    GridComponent,
    PieChart,
    TitleComponent,
    TooltipComponent,
    ToolboxComponent,
    LegendComponent,
])


const Pie = ({arr, width, height, title}) => {

    width = width || '350px';
    height = height || '250px';

    const data = counter(arr);
    const legendData = data.map((i) => i.name).sort(natsort());

    const options = {
        color: CAT_COLORS,
        ...titleOpts(title),
        ...toolboxOpts,
        tooltip: {
            trigger: 'item'
        },
        grid: {
            show: false,
            top: 0,
            left: 0,
            containLabel: true
        },
        legend: {
            type: 'scroll',
            // orient: 'vertical',
            // height: '75%',
            // align: "left",
            // right: '0%',
            // top: 'middle',
            data: legendData,
            bottom: 0,
            itemHeight: 12,
            itemWidth: 12,
            itemGap: 5,
            textStyle: {
                fontSize: 12,
            },
        },
        series: [
            {
                type: 'pie',
                roseType: false,
                radius: ['35%', '60%'],
                //radius: [50, 250],
                center: ['50%', '50%'],
                itemStyle: {
                    borderRadius: 8
                },
                label: {
                    show: true,
                    position: 'outside',
                },
                labelLine: {
                    show: true,
                    length: 20,
                    length2: 10
                },
                data: data,
            }
        ]
    }

    return <Echarts
        echarts={echarts}
        option={options}
        style={{width: 600, height: 600}}
    />
}

export default Pie;