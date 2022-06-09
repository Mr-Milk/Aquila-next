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
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import {useEffect, useState} from "react";

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
    const dataSize = cx.length + p1.length;

    const [show, setShow] = useState(false);

    useEffect(() => {
        if (dataSize < 10000) {
            setShow(true)
        }
    }, [dataSize])

    if (show) {
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
            toolbox: {
                itemSize: 13,
                top: '0%',
                right: '25%',
                feature: {
                    saveAsImage: {
                        show: true,
                        title: 'Save',
                    },
                }
            },
            legend: {
                type: "scroll",
                align: "left",
                right: '0%',
                left: 410,
                top: 'middle',
                height: '75%',
                width: 80,
                icon: "circle",
                data: categories,
                orient: 'vertical',
                itemHeight: 8,
                itemWidth: 8,
                formatter: function (name) {
                    return echarts.format.truncateText(name, 140, '14px Microsoft Yahei', '…');
                },
                tooltip: {
                    show: true
                },
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
                    left: '0%',
                    bottom: '0%',
                    width: 400,
                    height: 400,
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
            style={{width: "550px", height: "500px"}}
        />
    } else {
        return <Stack direction="column" alignItems="center">
            <Typography variant="caption">GPU support not available, render more than 100K elements may crash your
                browser.</Typography>
            <Button onClick={() => setShow(true)}>Render</Button>
        </Stack>
    }


}

export default GraphGL;