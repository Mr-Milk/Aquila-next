import max from "loadsh/max"
import min from "loadsh/min"

export const displayMinMax = (arr) => {
    const dmin = min(arr)
    const dmax = max(arr)

    const displayMin = Number.isInteger(dmin) ? dmin : Number(dmin.toFixed(2))
    const displayMax = Number.isInteger(dmax) ? dmax : Number(dmax.toFixed(2))

    return [displayMin, displayMax]
}

export const parseROIDisplay = (roiMeta) => {
    const name = [];
    Object.entries(roiMeta).forEach(([header, value]) => {
        if (!(header === 'roi_id') && !(header === 'data_uuid')) {
            name.push(`${header}: ${value}`)
        }
    })

    return name.join(" ")
}

const PREFIXES = {
    '24': 'Y',
    '21': 'Z',
    '18': 'E',
    '15': 'P',
    '12': 'T',
    '9': 'G',
    '6': 'M',
    '3': 'K',
    '0': '',
    '-3': 'm',
    '-6': 'µ',
    '-9': 'n',
    '-12': 'p',
    '-15': 'f',
    '-18': 'a',
    '-21': 'z',
    '-24': 'y'
};

function getExponent(n) {
    if (n === 0) {
        return 0;
    }
    return Math.floor(Math.log10(Math.abs(n)));
}

function precise(n) {
    return Number.parseFloat(n.toPrecision(3));
}

export function toHumanString(sn) {
    const n = Number.parseInt(sn);
    const e = Math.max(Math.min(3 * Math.floor(getExponent(n) / 3), 24), -24);
    return precise(n / Math.pow(10, e)).toString() + PREFIXES[e];
}

export function humanFileSize(bytes, si = false, dp = 1) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }

    const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


    return bytes.toFixed(dp) + ' ' + units[u];
}