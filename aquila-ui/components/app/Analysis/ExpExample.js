import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


const rows = [
    [ 12.521, 140.003,  53.465,  24.897],
   [173.945, 344.069,  71.739,  13.285],
   [125.416, 238.675,  42.647, 119.152],
   [124.698,  39.52 , 194.229,  90.743],
   [ 22.209,  21.824,   8.48 ,  76.917]
]


const ExpExample = () => {
    return (
        <TableContainer component={Paper} sx={{ boxShadow: 0, maxWidth: "350px" }}>
            <Table size="small">
                <TableHead sx={{ backgroundColor: 'primary.main', }}>
                    <TableCell sx={{ color: 'common.white' }}>Gene 1</TableCell>
                    <TableCell sx={{ color: 'common.white' }}>Gene 2</TableCell>
                    <TableCell sx={{ color: 'common.white' }}>Gene 3</TableCell>
                    <TableCell sx={{ color: 'common.white' }}>Gene 4</TableCell>
                </TableHead>
                <TableBody>
                    {rows.map((row, i) => (
                        <TableRow key={i}>
                            <TableCell>{row[0]}</TableCell>
                            <TableCell>{row[1]}</TableCell>
                            <TableCell>{row[2]}</TableCell>
                            <TableCell>{row[3]}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default ExpExample;