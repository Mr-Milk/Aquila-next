import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


const createRow = (x, y, t) => {
    return {x, y, t}
}

const rows = [
    createRow('5', '32', 'B Cell'),
    createRow('32', '101', 'T Cell'),
    createRow('244', '65', 'Cancer Cell'),
    createRow('237', '11', 'Leukocytes'),
    createRow('311', '291', 'macrophage'),
]


const CellInfoExample = () => {
    return (
        <TableContainer component={Paper} sx={{boxShadow: 0, maxWidth: "350px"}}>
            <Table size="small">
                <TableHead sx={{backgroundColor: 'primary.main',}}>
                    <TableCell sx={{color: 'common.white'}}>Cell X</TableCell>
                    <TableCell sx={{color: 'common.white'}}>Cell Y</TableCell>
                    <TableCell sx={{color: 'common.white'}}>Cell Type</TableCell>
                </TableHead>
                <TableBody>
                    {rows.map((row, i) => (
                        <TableRow key={i}>
                            <TableCell>{row.x}</TableCell>
                            <TableCell>{row.y}</TableCell>
                            <TableCell>{row.t}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default CellInfoExample;