export const responsiveSize = (size) => {
    const side = 0.015 * size + 300;
    return {
        height: `${side}px`,
        width: `${side + 200}px`
    }

}

export const responsiveSymbolSize = (size) => {
    if (size <= 1000) {
        return 5
    } else if (size <= 5000) {
        return 4
    } else if (size <= 10000) {
        return 3
    } else if (size <= 20000) {
        return 2
    } else {
        return 1
    }
}
