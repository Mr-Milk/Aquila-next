export const GRAD_COLORS = [
    "#ECDBBD",
    "#E8C4A4",
    "#E5AC93",
    "#E19488",
    "#D87C82",
    "#CC6680",
    "#B9537E",
    "#A2437C",
    "#863576",
    "#68296B",
    "#49205A",
    "#2C1641",
    "#130C23",
    "#000000",
];

export const RDBU11 = [
    '#053061',
    '#2166ac',
    '#4393c3',
    '#92c5de',
    '#d1e5f0',
    '#f7f7f7',
    '#fddbc7',
    '#f4a582',
    '#d6604d',
    '#b2182b',
    '#67001f',
]

export const CAT_COLORS = [
    "#5470c6",
    "#91cc75",
    "#fac858",
    "#ee6666",
    "#73c0de",
    "#3ba272",
    "#fc8452",
    "#9a60b4",
    "#ea7ccc",
    "#c1232b",
    "#27727b",
    "#fcce10",
    "#e87c25",
    "#b5c334",
    "#fe8463",
    "#9bca63",
    "#fad860",
    "#f3a43b",
    "#60c0dd",
    "#d7504b",
    "#c6e579",
    "#f4e001",
    "#f0805a",
    "#26c0c0"]

export const titleOpts = (title) => ({
    title: {
        text: title,
        left: "center",
        top: "top",
        textStyle: {
            fontSize: 14,
        },
    }
})

export const tooltipOpts = () => ({
    tooltip: {
        trigger: 'item',
        formatter: "{c}",
    }
})

export const legendOpts = (data) => ({
    legend: {
        data: data,
        orient: "vertical",
        right: "right",
        top: "center",
        itemHeight: 8,
        itemWidth: 8,
        textStyle: {
            fontSize: 8,
        },
    },
})

export const toolboxOpts = () => ({
    toolbox: {
        show: true,
        itemSize: 13,
        feature: {
            dataZoom: {},
            dataView: {},
            restore: {},
            saveAsImage: {}
        }
    }
})
