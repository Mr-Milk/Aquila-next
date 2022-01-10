import useSWR from "swr";
import {fetcher, getOneRecordURL} from "data/get";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link"
import {TechChip} from "components/InfoDisplay/Chips";


const TitleCol = (props) => {
    return <TableCell>
        <Typography sx={{fontWeight: "medium"}} variant={"body2"}>
            {props.children}
        </Typography>
    </TableCell>
}


const TextCol = (props) => {
    return <TableCell>
        <Typography variant={"body2"}>
            {props.children}
        </Typography>
    </TableCell>
}


const InfoRow = ({title, info}) => {
    return <TableRow>
        <TitleCol>{title}</TitleCol>
        <TextCol>{info}</TextCol>
    </TableRow>
}

const RecordDetailsTable = ({dataID}) => {

    const {data, error} = useSWR(`${getOneRecordURL}/${dataID}`, fetcher);

    if (data === undefined) {
        return <></>
    } else {
        return (
            <TableContainer component={Paper} sx={{boxShadow: 0, maxWidth: "550px"}}>
                <Table size="small">
                    <TableBody>
                        <TableRow>
                            <TitleCol>Technology</TitleCol>
                            <TableCell>
                                <TechChip name={data.technology}/>
                            </TableCell>
                        </TableRow>
                        <InfoRow title="Molecule" info={data.molecule}/>
                        <InfoRow title="Species" info={data.species}/>
                        <InfoRow title="Tissue" info={data.tissue}/>
                        <InfoRow title="Disease" info={data.disease}/>
                        <TableRow>
                            <TitleCol>Publication</TitleCol>
                            <TableCell>
                                <Link href={data.source_url} target="_blank" rel="noreferrer" sx={{
                                    color: "black",
                                    '&:hover': {
                                        color: "primary.main"
                                    },
                                    textDecoration: "none"
                                }}>
                                    <Typography variant={"body2"}>
                                        {`${data.journal}, ${data.year}`}🔗
                                    </Typography>
                                </Link>
                            </TableCell>
                        </TableRow>

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


}

export default RecordDetailsTable;