export const getBBox = (x, y) => {
    return {x1: Math.min(...x), x2: Math.max(...x), y1: Math.min(...y), y2: Math.max(...y)}
}

export const getBBox3D = (x, y, z) => {
    return {
        x1: Math.min(...x),
        x2: Math.max(...x),
        y1: Math.min(...y),
        y2: Math.max(...y),
        z1: Math.min(...z),
        z2: Math.max(...z)
    }
}