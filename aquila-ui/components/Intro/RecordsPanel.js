import DataRecordList from "../DataTable/DataRecordList";
import {useState} from "react";
import FilterList from "../DataTable/FilterList";
import SearchRecords from "../DataTable/SearchRecords";
import Divider from "@mui/material/Divider";
import SortButton from "../DataTable/SortButton";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";


const RecordsPanel = ({data}) => {
    const [displayData, setDisplayData] = useState(data)

    if (displayData === undefined) {
        return null
    }

    return (
        <>
            <FilterList data={data} updateDataFn={setDisplayData}/>
            <Divider sx={{mb: 6}}></Divider>
            <Grid container justifyContent="center" alignItems="center" sx={{
                px: 10,
                my: 4,
            }}>
                <Grid item>
                    <SearchRecords data={data} updateDataFn={setDisplayData}/>
                </Grid>
                <Grid item>
                    <SortButton displayData={displayData} updateDataFn={setDisplayData}/>
                </Grid>
            </Grid>

            <DataRecordList data={displayData}/>
        </>

    )
}

export default RecordsPanel;