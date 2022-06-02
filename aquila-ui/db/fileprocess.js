import Papa from 'papaparse';
import {v4 as uuid4} from 'uuid';
import {db} from 'db/schema';
import * as Comlink from "comlink";
import cloneDeep from "loadsh/cloneDeep";


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


function roiRecord(file, dataID) {

    console.log("call roi record")

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
                        // check if the roi exist
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


async function cellInfo(file, dataID, roiCellCount, roiMapper) {

    let records = {}
    Object.keys(roiCellCount).map((k) => {
        records[k] = {
        cell_x: [],
        cell_y: [],
        cell_type: [],
    }
    })
    //console.log(records)
    let hasCellType = false
    let lineCount = 0
    let cellXHeader, cellYHeader, cellTypeHeader;

    const header = await getHeader(file);
    //console.log(header)
    // parse the first 10 lines to check for cell type and header
    cellXHeader = header[0]
    cellYHeader = header[1]
    if (header.length > 2) {
        hasCellType = true
        cellTypeHeader = header[2]
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
                    records[roiID].cell_x.push(parseFloat(d[cellXHeader]))
                    records[roiID].cell_y.push(parseFloat(d[cellYHeader]))
                    // ensure the cell type format is consistent with database schema
                    if (hasCellType) {
                        records[roiID].cell_type.push(d[cellTypeHeader])
                    }
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
                    delete records[roiID]
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


async function expInfo(file, dataID, roiCellCount, roiMapper) {

    let lineCount = 0

    const header = await getHeader(file);
    const markerCount = header.length
    const template = {}
    header.map((k) => {
        template[k] = []
    })
    const records = {}
    Object.keys(roiCellCount).map((k) => {
        records[k] = cloneDeep(template)
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
                console.log("start parsing a chunk a exp file")
                results.data.map((d) => {
                    let roiID = roiMapper[lineCount]
                    Object.entries(d).map(([k, v]) => {
                        records[roiID][k].push(parseFloat(v))
                    })
                    console.log("Finish getting a line of exp file")
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
                            delete records[roiID]
                        }

                    })
                    lineCount += 1
                })
                console.log("finish parse a chunk a exp file")
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


const fileApi = {
    roiRecord,
    cellInfo,
    expInfo,
}

Comlink.expose(fileApi);
