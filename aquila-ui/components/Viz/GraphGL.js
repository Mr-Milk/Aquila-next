import Echarts from "./echarts-obj";
import * as echarts from 'echarts/core';
import 'echarts-gl';
import {GraphChart} from 'echarts/charts';
import {titleOpts, toolboxOpts} from "./config";
import Typography from "@mui/material/Typography";
import {CanvasRenderer} from "echarts/renderers";
import {
    GridComponent,
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    VisualMapComponent
} from "echarts/components";
import {responsiveSymbolSize} from "./responsiveSize";

echarts.use([
    CanvasRenderer,
    GraphChart,
    GridComponent,
    TitleComponent,
    TooltipComponent,
    ToolboxComponent,
    VisualMapComponent,
])


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


const GraphGL = ({title, cx, cy, ct, p1, p2, weights, rotate, community}) => {

    if (cx.length < 6000) {
        if (rotate !== 0) {
            [cx, cy] = rotatePoint(cx, cy, [0, 0], rotate)
        }

        let setCT = false;
        if (ct === undefined) {
            setCT = true
        } else {
            if (ct.length === 0) {
                setCT = true
            }
        }

        if (setCT) {
            ct = cx.map((_) => 'Unknown')
        }

        let category = new Set(ct);
        category = [...category]
        let categories = category.map((r) => {
            return {name: r}
        });
        let catMap = {};
        category.map((r, i) => {
            catMap[r] = i
        })

        const nodes = cx.map((x, i) => {
            return {x: x, y: cy[i], category: catMap[ct[i]]}
        })

        let edges = []
        if (community) {
            p1.map((p, i) => {
                // if the two nodes are the same cluster, they will have link
                if ((ct[p] !== 0) && (ct[p] === ct[p2[i]])) {
                    edges.push({source: p, target: p2[i], value: weights[i].toFixed(2)})
                }
            })
        } else {
            p1.map((p, i) => {
                edges.push({source: p, target: p2[i], value: weights[i].toFixed(2)})
            })
        }

        const option = {
            ...titleOpts(title),
            ...toolboxOpts,
            legend: {
                data: categories,
                orient: 'vertical',
                left: '77%',
                top: 'middle',
                itemHeight: 8,
                itemWidth: 8
            },
            grid: {
                show: false,
                left: '10%',
                right: '25%',
                top: '10%',
                bottom: '10%'
            },
            series: [
                {
                    type: "graph",
                    nodes: nodes,
                    edges: edges,
                    roam: true,
                    categories: [...categories],
                    layout: 'none',
                    symbolSize: responsiveSymbolSize(cx.length),
                    // itemStyle: {
                    //     color: "#0D5661",
                    //     opacity: 1
                    // },
                    lineStyle: {
                        color: "#72636E",
                        opacity: 0.8,
                        width: 0.5
                    }
                }
            ],
            tooltip: {
                formatter: '{c}'
            },

        }

        return <Echarts
            echarts={echarts}
            option={option}
            style={{width: "750px", height: "450px"}}
        />
    } else {
        return <Typography>Cannot render more than 500K elements</Typography>
    }


}

export default GraphGL;