import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


const createRow = (patient, organ, roi) => {
    return {patient, organ, roi}
}

const rows = [
    createRow('p1', 'liver', 'ROI 1'),
    createRow('p1', 'liver', 'ROI 1'),
    createRow('p1', 'liver', 'ROI 1'),
    createRow('p1', 'liver', 'ROI 1'),
    createRow('p1', 'liver', 'ROI 2'),
    createRow('p1', 'liver', 'ROI 2'),
    createRow('p1', 'liver', 'ROI 2'),
    createRow('p1', 'liver', 'ROI 2'),
]


const MetaExample = () => {
    return (
        <TableContainer component={Paper} sx={{ boxShadow: 0, maxWidth: "350px" }}>
            <Table size="small">
                <TableHead sx={{ backgroundColor: 'primary.main', }}>
                    <TableCell sx={{ color: 'common.white' }}>Patient</TableCell>
                    <TableCell sx={{ color: 'common.white' }}>Organ</TableCell>
                    <TableCell sx={{ color: 'common.white' }}>ROI</TableCell>
                </TableHead>
                <TableBody>
                    {rows.map((row, i) => (
                        <TableRow key={i}>
                            <TableCell>{row.patient}</TableCell>
                            <TableCell>{row.organ}</TableCell>
                            <TableCell>{row.roi}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default MetaExample;