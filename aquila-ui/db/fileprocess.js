import Papa from 'papaparse';
import {v4 as uuid4} from 'uuid';
import {db} from 'db/schema';


const getHeader = (file, preview = 10) => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            preview,
            error: (e) => {
                reject(e)
            },
            complete: (results) => {
                console.log("This should print first")
                resolve(results.meta.fields)
            },
        })
    })
}


export function roiRecord(file, dataID) {

    let roiCellCount = {};
    let roiMapper = {};
    let roiUUID = {};
    let lineCount = 0;
    let uuid = "";

    return new Promise((resolve, reject) => {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                error: (e) => {
                    reject(e)
                },
                chunk: (results) => {
                    results.data.map((d) => {
                        let roiName = Object.values(d).toString();
                        if (roiUUID.hasOwnProperty(roiName)) {
                            roiMapper[lineCount] = uuid
                            roiCellCount[roiUUID[roiName]] += 1
                        } else {
                            // generate a new UUID for roiID
                            uuid = uuid4();
                            roiUUID[roiName] = uuid
                            roiMapper[lineCount] = uuid

                            // record the line
                            roiCellCount[uuid] = 1

                            // create a new roi record
                            const record = {
                                roi_id: uuid,
                                data_uuid: dataID,
                                meta: JSON.stringify({
                                    ...d,
                                    roi_id: uuid,
                                })
                            }

                            // write to the db
                            db.ROIInfo.add(record);

                        }
                        lineCount += 1;
                    })
                },
                complete: () => {
                    console.log(lineCount)
                    resolve({
                        roiCount: Object.keys(roiCellCount).length,
                        cellCount: lineCount,
                        roiCellCount,
                        roiMapper,
                    })
                }
            })
        }
    )
}


export async function cellInfo(file, dataID, roiCellCount, roiMapper) {

    const template = {
        cell_x: [],
        cell_y: [],
        cell_type: [],
    }

    let records = {}
    Object.keys(roiCellCount).map((k) => {
        records[k] = template
    })
    console.log(records)
    let hasCellType = false
    let lineCount = 0
    let cellX, cellY, cellT;

    const header = await getHeader(file);
    console.log(header)
    // parse the first 10 lines to check for cell type and header
    cellX = header[0]
    cellY = header[1]
    if (header.length > 2) {
        hasCellType = true
        cellT = header[2]
    }

    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            error: (e) => {
                reject(e)
            },
            chunk: (results) => {
                results.data.map((d) => {
                    let roiID = roiMapper[lineCount]
                    records[roiID].cell_x.push(d[cellX])
                    records[roiID].cell_y.push(d[cellY])
                    records[roiID].cell_type.push(hasCellType ? d[cellT] : "")
                    lineCount += 1
                })

                // check if any records should be added to the db
                Object.keys(records).map(async (roiID) => {
                    if (records[roiID].cell_x.length === roiCellCount[roiID]) {
                        await db.CellInfo.add({
                            data_uuid: dataID,
                            roi_id: roiID,
                            ...records[roiID]
                        })
                    }
                    // gc may not need, only hundreds of MB even for millions of data
                    // delete records[roiID]
                })
            },
            complete: () => {
                Object.keys(records).map((roiID) => {
                    db.CellInfo.add({
                        data_uuid: dataID,
                        roi_id: roiID,
                        ...records[roiID]
                    })
                })
                resolve(hasCellType)
            }
        },)
    })
}


export async function expInfo(file, dataID, roiCellCount, roiMapper) {

    let lineCount = 0

    const header = await getHeader(file);
    const markerCount = header.length
    const template = {}
    header.map((k) => {
        template[k] = []
    })
    const records = {}
    Object.keys(roiCellCount).map((k) => {
        records[k] = template
    })

    console.log("before parse exp file")

    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            error: (e) => {
                reject(e)
            },
            chunk: (results) => {
                results.data.map((d) => {
                    let roiID = roiMapper[lineCount]
                    Object.entries(d).map(([k, v]) => {
                        records[roiID][k].push(v)
                    })
                    Object.keys(records).map((roiID) => {
                        if (records[roiID][header[0]].length === roiCellCount[roiID]) {
                            db.CellExp.bulkAdd(
                                Object.entries(records[roiID]).map(([marker, exp]) => ({
                                    data_uuid: dataID,
                                    roi_id: roiID,
                                    marker: marker,
                                    expression: exp,
                                }))
                            )
                        }
                    })
                    lineCount += 1
                })
                console.log("parse a chunk a exp file")
            },
            complete: () => {
                Object.keys(records).map((roiID) => {
                    db.CellExp.bulkAdd(
                        Object.entries(records[roiID]).map(([marker, exp]) => ({
                            data_uuid: dataID,
                            roi_id: roiID,
                            marker: marker,
                            expression: exp,
                        })))
                })

                resolve({
                    markers: header,
                    markerCount
                })
            }
        })
    })
}
