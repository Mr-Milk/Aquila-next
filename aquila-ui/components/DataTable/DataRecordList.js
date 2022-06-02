import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import {GiSeatedMouse} from "react-icons/gi";
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import {IoIosMan} from 'react-icons/io'
import MUILink from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import DNA from "../icons/DNA";
import Molecule from "../icons/Molecule";
import {useState} from "react";
import Link from "../Link";
import {toHumanString} from "../humanize";
import Tooltip from "@mui/material/Tooltip";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from "@mui/material/IconButton";
import DownloadIcon from '@mui/icons-material/Download';


const SpeciesChip = ({species}) => {
    if (species === 'Mouse') {
        return <Chip size="small" icon={<GiSeatedMouse color="#5c6bc0"/>} label='Mouse' variant="outlined"
                     sx={{color: "#5c6bc0", borderColor: "#5c6bc0"}}/>
    } else {
        return <Chip size="small" icon={<IoIosMan color="#42a5f5"/>} label={species} variant="outlined"
                     sx={{color: "#42a5f5", borderColor: "#42a5f5"}}/>
    }
}

const DimChip = ({is3d}) => {
    if (is3d) {
        return <Chip size="small" icon={<ViewInArIcon color="inherit"/>} label='3D'/>
    } else {
        return <Chip size="small" label={'2D'}/>
    }
}

// const MoleculeChip = ({molecule}) => {
//     if (molecule === 'RNA') {
//         return <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
//             <DNA/>
//             <Typography>RNA</Typography>
//         </Stack>
//     } else {
//         return <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
//             <Molecule/>
//             <Typography>Protein</Typography>
//         </Stack>
//     }
// }

const MoleculeChip = ({molecule}) => {
    if (molecule === 'RNA') {
        return <Chip label={"RNA"} avatar={<DNA/>} size="small"></Chip>
    } else {
        return <Chip label={"Protein"} avatar={<Molecule/>} size="small"></Chip>
    }
}

const ReadMore = ({text, wordcount}) => {

    const [expand, setExpand] = useState(false);
    return <Box sx={{display: 'flex', my: 2}}>
        <Typography sx={{fontSize: "0.8rem", lineClamp: 1,}}>{text}</Typography>
        <Typography sx={{fontSize: "0.8rem", color: "#757575"}}
                    onClick={() => setExpand(!expand)}>{expand ? '<' : '>>'}</Typography>
    </Box>
}

const techColor = {
    'Visium': '#0043A4',
    'IMC': '#7C0072',
    'CyCIF': '#9e9d24',
    'MIBI': '#0C0C7C',
    'seqFISH': '#66C2A5',
    'CODEX': '#B62232',
    'MERFISH': '#212121',
    // 'seq-scope': '',
    'STARmap': '#F06292',
    // 'DBiT-seq': '',
    // 'osmFISH': '',
    // 'pciSeq': '',
    // 'sci-Space': ''
}

const getTechColor = (tech) => {
    if (techColor.hasOwnProperty(tech)) {
        return techColor[tech]
    } else {
        return '#ff9800'
    }
}

const shortJournal = {
    "COMMUNICATIONS BIOLOGY": "COMMS BIOLOGY",
    "NATURE COMMUNICATIONS": "NATURE COMMS",
    "JOURNAL OF THE AMERICAN SOCIETY OF NEPHROLOGY": "JASN",
    "PROCEEDINGS OF THE NATIONAL ACADEMY OF SCIENCES": "PNAS",
    "ELIFE SCIENCES PUBLICATIONS, LTD": "eLife"
}

const getJournal = (journal) => {
    journal = journal.toUpperCase()
    if (shortJournal.hasOwnProperty(journal)) {
        return shortJournal[journal]
    } else {
        return journal
    }
}

const TechChip = ({tech}) => {
    return <Chip size={"small"} label={tech} sx={{color: 'white', bgcolor: getTechColor(tech)}}></Chip>
}


const StatsText = ({count, unit}) => {
    return <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'flex-end'}}>

        <Typography variant="h5">{toHumanString(count)}</Typography>
        <Typography variant="caption" sx={{ml: 0.5}}>{unit}</Typography>
    </Box>
}


const DataRecordCard = ({record}) => {

    let tissue;
    let disease;
    if (record.organ === record.tissue) {
        tissue = record.tissue
    } else {
        tissue = `${record.organ}-${record.tissue}`
    }

    if (record.disease_details) {
        disease = `${record.disease} (${record.disease_details})`
    } else {
        disease = `${record.disease}`
    }

    return <Container maxWidth="400px">
        <Paper square elevation={1} sx={{
            my: 2,
            pt: 2,
            pb: 1,
            px: 4,
            border: 1,
            borderRadius: '8px',
            borderColor: 'rgba(253,151,0,0.45)'
        }}>
            <Grid container direction="row" spacing={2} justifyContent="flex-start">
                <Grid item>
                    <SpeciesChip species={record.species}/>
                </Grid>
                <Grid item>
                    <Chip size="small" label={tissue} variant="outlined"
                          sx={{color: '#ec407a', borderColor: '#ec407a'}}></Chip>
                </Grid>
                <Grid item>
                    <Chip size="small" label={disease} variant="outlined"
                          color={(disease === 'Normal') ? 'success' : 'error'}></Chip>
                </Grid>
                <Grid item>

                </Grid>
            </Grid>

            <Stack direction="row" justifyContent="space-between" spacing={4} sx={{my: 2}}>
                <StatsText count={record.cell_count} unit={record.is_single_cell ? 'Cell' : 'Spot'}/>
                <StatsText count={record.marker_count} unit={record.molecule === 'RNA' ? 'Gene' : 'Marker'}/>
                <StatsText count={record.roi_count} unit={'ROI'}/>
            </Stack>

            <Grid container direction="row" spacing={2} alignItems="center">
                <Grid item>
                    <TechChip tech={record.technology}/>
                </Grid>
                <Grid item>
                    <DimChip is3d={record.is_3d}/>
                </Grid>
                <Grid item>
                    <MoleculeChip molecule={record.molecule}/>
                </Grid>
                <Grid item>
                    <Chip label={'Cell Type'}
                          icon={record.has_cell_type ?
                              <CheckIcon sx={{"&&": {color: "#00896C"}}}/> :
                              <CloseIcon sx={{"&&": {color: "#CB4042"}}}/>}
                          variant="filled"
                          size="small"
                    />
                </Grid>
            </Grid>

            <Divider sx={{my: 1}}/>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" alignItems="center">
                <Button size="small" endIcon={<ChevronRightIcon/>}>
                    <Link href={record.is_3d ? `/view3d/${record.data_uuid}` : `/view/${record.data_uuid}`}>View</Link>
                </Button>
                <IconButton size="small" href={`https://api.aquila.cheunglab.org/static/${record.data_uuid}.zip`} color="primary">
                    <DownloadIcon/>
                </IconButton>
                    </Stack>
                <Tooltip title={record.source_name}>
                    <MUILink href={record.source_url} target="_blank" color="#757575">
                        {`${getJournal(record.journal)}, ${record.year}`.toUpperCase()}
                    </MUILink>
                </Tooltip>

            </Stack>
        </Paper>
    </Container>
}

const DataRecordList = ({data}) => {
    return <Container maxWidth={'xl'} sx={{minHeight: '1vh'}}>

        {
            (data.length === 0) ?
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 6,
                    mt: 4,
                    height: '300px'
                }}>
                    <Typography variant="h5">😥 No Dataset Found</Typography>
                </Box>

                :
                <Grid container spacing={{xs: 2, md: 3}} columns={{xs: 4, md: 12}}>
                    {data.map((r, i) => (
                        <Grid item xs={4} md={6} key={i}>
                            <DataRecordCard record={r}/>
                        </Grid>
                    ))}
                </Grid>
        }
    </Container>
}

export default DataRecordList;