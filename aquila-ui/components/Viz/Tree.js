import {toolboxOpts} from "components/Viz/config";
import Echarts from "./echarts-obj";

import * as echarts from 'echarts/core';
import {CanvasRenderer} from 'echarts/renderers';
import {TreeChart} from 'echarts/charts';
import {GridComponent, TooltipComponent} from 'echarts/components';

echarts.use([
    CanvasRenderer,
    GridComponent,
    TreeChart,
    TooltipComponent,
])

const Tree = ({data}) => {

    const options = {
        ...toolboxOpts,
        series: [{
            type: 'tree',
            top: '1%',
            left: '20%',
            bottom: '1%',
            right: '20%',
            data: [data],
            symbolSize: 10,
            label: {
                position: 'left',
                verticalAlign: 'middle',
                overflow: 'break'
            },
            leaves: {
                label: {
                    position: 'right',
                    verticalAlign: 'middle',
                    align: 'left'
                }
            },
            emphasis: {
                focus: 'descendant'
            },
        }]

    }

    return <Echarts
        echarts={echarts}
        option={options}
        style={{width: 600, height: 600}}
    />
}

export default Tree;