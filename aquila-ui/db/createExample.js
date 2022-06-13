import {db} from 'db/schema';

// import example data
import dataRecord from './exampleData/DataRecord.json';
import roiInfo from './exampleData/ROIInfo.json';
import cellInfo from './exampleData/CellInfo.json';
import expInfo from './exampleData/ExpInfo.json';

export const createExample = () => {

    db.ROIInfo.bulkAdd(roiInfo)
    db.CellInfo.bulkAdd(cellInfo)
    db.CellExp.bulkAdd(expInfo)

    // add record at the very last
    // so that it looks like we add it fast
    const record = {
        ...dataRecord,
        created_at: new Date().getTime(),
    }

    db.DataRecords.add(record)
}