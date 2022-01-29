import Echarts from "./echarts-obj";
import {titleOpts} from "./config";


const Graph = ({ title, nodes1, nodes2, edgeV, width, height }) => {

    const renderData = [...new Set([...nodes1, ...nodes2])].map((n, i) => {
        return {
            id: i,
            name: n,
        }
    })

    const links = nodes1.map((n, i) => {
        return {
            source: n,
            target: nodes2[i],
            value: edgeV[i],
            lineStyle: {
                    width: 5,
                }
        }
    })

    const option = {
        ...titleOpts(title),
        grid: {
            left: '100%'
        },
        series: [
            {
                type: "graph",
                layout: "force",
                data: renderData,
                links: links,
            }
        ]

    }

    return <Echarts
        option={option}
        style={{width: width, height: height}}
    />
}

export default Graph;