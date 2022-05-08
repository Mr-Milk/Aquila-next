import max from "loadsh/max"
import min from "loadsh/min"

export const getBBox = (x, y) => {
    return {
        x1: min(x),
        x2: max(x),
        y1: min(y),
        y2: max(y)
    }
}

export const getBBox3D = (x, y, z) => {
    return {
        x1: min(x),
        x2: max(x),
        y1: min(y),
        y2: max(y),
        z1: min(z),
        z2: max(z)
    }
}

export const getDefaultR = (bbox) => {
    const minSide = Math.min((bbox.x2 - bbox.x1), (bbox.y2 - bbox.y1))
    return (minSide / 10).toFixed(2)
}