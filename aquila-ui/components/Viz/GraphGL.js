import Echarts from "./echarts-obj";
import * as echarts from 'echarts/core';
import 'echarts-gl';
import {titleOpts} from "./config";


const rotatePoint = (px, py, origin, angle) => {
    let rad = angle * (Math.PI / 180);
    let [ox, oy] = origin;

    let xOffSet = px.map((x) => {
        return x - ox
    })
    let yOffSet = py.map((y) => {
        return y - oy
    })

    let sinRad = Math.sin(rad);
    let cosRad = Math.cos(rad);

    let qx = [];
    let qy = [];
    xOffSet.map((vx, i) => {
        let vy = yOffSet[i];

        qx.push(ox + cosRad * vx - sinRad * vy)
        qy.push(oy + sinRad * vx + cosRad * vy)
    })

    return [qx, qy];
}


const GraphGL = ({title, cx, cy, p1, p2, rotate}) => {

    if (rotate !== 0) {
        [cx, cy] = rotatePoint(cx, cy, [0, 0], rotate)
    }

    const nodes = cx.map((x, i) => {
        return {x: x, y: cy[i]}
    })

    const edges = p1.map((p, i) => {
        return {source: p, target: p2[i]}
    })

    const option = {
        ...titleOpts(title),
        series: [
            {
                type: "graphGL",
                nodes: nodes,
                edges: edges,
                layout: false,
                symbolSize: 5,
                itemStyle: {
                    color: "#0D5661",
                    opacity: 1
                },
                lineStyle: {
                    color: "#72636E",
                    opacity: 0.8,
                    width: 1
                }
            }
        ]

    }

    return <Echarts
        echarts={echarts}
        option={option}
        style={{width: "450px", height: "450px"}}
    />
}

export default GraphGL;