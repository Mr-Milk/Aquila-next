import DataRecordList from "../DataTable/DataRecordList";
import {useState} from "react";
import FilterList from "../DataTable/FilterList";
import SearchRecords from "../DataTable/SearchRecords";
import Divider from "@mui/material/Divider";
import SortButton from "../DataTable/SortButton";
import Box from "@mui/material/Box";


const RecordsPanel = ({data}) => {
    const [displayData, setDisplayData] = useState(data)

    if (displayData === undefined) {
        return null
    }

    return (
        <>
            <FilterList data={data} updateDataFn={setDisplayData}/>
            <Divider sx={{mb: 6}}></Divider>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 10,
                my: 4,
            }}>
                <SearchRecords data={data} updateDataFn={setDisplayData}/>
                <SortButton displayData={displayData} updateDataFn={setDisplayData}/>
            </Box>

            <DataRecordList data={displayData}/>
        </>

    )
}

export default RecordsPanel;