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
import Chip from "@mui/material/Chip";
import {InfoRow, TitleCol} from "./utils";

const LinkPool = {
    MIBI: "https://www.ionpath.com/",
    IMC: "https://www.fluidigm.com/applications/imaging-mass-cytometry",
    CODEX: "https://www.akoyabio.com/codex/",
    CyCIF: "https://www.cycif.org/",

    Visium: "https://www.10xgenomics.com/products/spatial-gene-expression",
    seqFISH: "https://www.seqfish.com/",
    osmFISH: "https://linnarssonlab.org/osmFISH/",
    MERFISH: "http://zhuang.harvard.edu/merfish.html",
    'seq-scope': "https://lee.lab.medicine.umich.edu/seq-scope",
    STARmap: "https://www.starmapresources.org/",
    'sci-Space': "https://www.science.org/doi/10.1126/science.abb9536",
    'DBiT-seq': "https://www.sciencedirect.com/science/article/pii/S2666166721002392",
    'pciSeq': "https://www.nature.com/articles/s41592-019-0631-4",
    'Steoro-seq': "https://www.sciencedirect.com/science/article/pii/S0092867422003993",
};

const TechChip = ({name}) => {
    return (
        <a href={LinkPool[name]} target="_blank" rel="noreferrer noopener" style={{textDecoration: "none"}}>
            <Chip
                variant="outlined"
                label={name}
                color="primary"
                size="small"
                sx={{
                    cursor: "pointer",
                }}
            />
        </a>
    )
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
                                    color: "text.primary",
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