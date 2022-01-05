import * as dfd from "danfojs/src/index";


function getGroupsNames(groupbyObj) {
    let groups = []
    function flatten(obj) {
        Object.entries(obj).map(([k, v]) => {
                if (v instanceof Array) {
                    Array.prototype.push.apply(groups, v)
                    return;
                } else {
                    flatten(v)
                }
            }
        )
    }

    return groups;
}

const readROIInfo = (csvFileObject) => {
    const options = {
        header: true,
    }
    dfd.read_csv(csvFileObject, options).then((data) => {

    })
}