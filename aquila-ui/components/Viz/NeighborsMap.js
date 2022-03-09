// import ReactECharts from 'echarts-for-react';
import Echarts from "./echarts-obj";
import PropTypes from 'prop-types'
import {legendOpts, titleOpts} from "components/Viz/config";


const NeighborsMap = ({cx, cy, ct, neighborsOne, neighborsTwo, showNeighbors, ...leftProps}) => {

    const hasCellType = (ct !== undefined);
    const size = cx.length;
    const canvasSize = 5;
    const symbolSize = 5;

    const renderData = [];
    const categories = [];
    const links = [];
    const legendData = hasCellType ? [...new Set(ct)] : ['unknown'];

    cx.map((x, i) => {
        renderData.push({
            id: i,
            x: x,
            y: cy[i],
            value: hasCellType ? ct[i] : "unknown",
            category: hasCellType ? ct[i] : "unknown",
        })
        categories.push({
            name: hasCellType ? ct[i] : "unknown"
        })
    })

    if (showNeighbors && (neighborsOne !== undefined)) {
        neighborsOne.map((n, i) => {
            links.push({
                source: n,
                target: neighborsTwo[i],
                lineStyle: {
                    width: 1,
                }
            })
        })
    }

    const options = {
        ...titleOpts("Cell Map"),
        ...legendOpts(legendData),
        grid: {
            left: '100%'
        },
        tooltip: {
            trigger: "item",
            formatter: "{c}",
        },
        series: [
            {
                type: "graph",
                layout: "none",
                symbolSize: symbolSize,
                data: renderData,
                categories: categories,
                links: showNeighbors ? links : [],
            },
        ],
    }

    return <Echarts option={options} style={canvasSize}/>
}

NeighborsMap.propTypes = {
    cx: PropTypes.array,
}

export default NeighborsMap;