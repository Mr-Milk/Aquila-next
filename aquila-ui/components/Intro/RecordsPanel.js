import DataRecordList from "../DataTable/DataRecordList";
import {useState} from "react";
import FilterList from "../DataTable/FilterList";
import SearchRecords from "../DataTable/SearchRecords";
import SortButton from "../DataTable/SortButton";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";


const RecordsPanel = ({data}) => {
    const [displayData, setDisplayData] = useState(data);

    if (displayData === undefined) {
        return null
    }

    return (
        <>
            <Box sx={{
                display: {
                    xs: 'none',
                    md: 'block',
                },
                py: 2,
                mb: 4,
                backgroundColor: "#fafafa"
            }}>
                <Grid
                    container
                      justifyContent="center"
                      alignItems="center"
                      sx={{
                    px: 4,
                    my: 2,
                }}>
                    <Grid item>
                        <SearchRecords data={data} updateDataFn={setDisplayData}/>
                    </Grid>
                    <Grid item>
                        <SortButton displayData={displayData} updateDataFn={setDisplayData}/>
                    </Grid>
                </Grid>
                <FilterList data={data} updateDataFn={setDisplayData}/>
            </Box>

            <DataRecordList data={displayData}/>
        </>

    )
}

export default RecordsPanel;