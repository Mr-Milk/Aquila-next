import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import {InfoRow} from "./utils";


const AnalysisRecordTable = ({ data }) => {

        return (
            <TableContainer component={Paper} sx={{boxShadow: 0, maxWidth: "550px"}}>
                <Table size="small">
                    <TableBody>
                        <InfoRow title="Cell Number" info={data.cell_count}/>
                        <InfoRow title="Marker Number" info={data.marker_count}/>
                        <InfoRow title="ROI Number" info={data.roi_count}/>
                        <InfoRow title="Single Cell" info={data.is_single_cell ? "Yes" : "No"}/>
                        <InfoRow title="Cell Type" info={data.has_cell_type ? "Yes" : "No"}/>
                    </TableBody>
                </Table>
            </TableContainer>

        )

}

export default AnalysisRecordTable;