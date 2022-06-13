import Chip from "@mui/material/Chip";
import {GiSeatedMouse} from "react-icons/gi";
import {IoIosMan} from "react-icons/io";
import ViewInArOutlinedIcon from "@mui/icons-material/ViewInArOutlined";
import SquareIcon from "@mui/icons-material/Square";
import DNA from "../icons/DNA";
import Molecule from "../icons/Molecule";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {toHumanString} from "../humanize";
import MUILink from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";

export const SpeciesChip = ({species}) => {
    if (species === 'Mouse') {
        return <Chip size="small" icon={<GiSeatedMouse color="#5c6bc0" fontSize="small"/>} label='Mouse'
                     variant="outlined"
                     sx={{color: "#5c6bc0", borderColor: "#5c6bc0"}}/>
    } else {
        return <Chip size="small" icon={<IoIosMan color="#42a5f5" fontSize="small"/>} label={species} variant="outlined"
                     sx={{color: "#42a5f5", borderColor: "#42a5f5"}}/>
    }
}

export const DimChip = ({is3d}) => {
    if (is3d) {
        return <Chip size="small" icon={<ViewInArOutlinedIcon color="inherit" fontSize="small"/>} label='3D'/>
    } else {
        return <Chip size="small" icon={<SquareIcon color="inherit" fontSize="small"/>} label={'2D'}/>
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

export const MoleculeChip = ({molecule}) => {
    if (molecule === 'RNA') {
        return <Chip label={"RNA"} avatar={<DNA/>} size="small"></Chip>
    } else {
        return <Chip label={"Protein"} avatar={<Molecule/>} size="small"></Chip>
    }
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

export const JournalText = ({record}) => {
    return <Tooltip title={record.source_name}>
        <MUILink href={record.source_url} target="_blank" color="#757575">
            {`${getJournal(record.journal)}, ${record.year}`.toUpperCase()}
        </MUILink>
    </Tooltip>
}

export const TechChip = ({tech}) => {
    return <Chip size={"small"} label={tech} sx={{color: 'white', bgcolor: getTechColor(tech)}}></Chip>
}


export const StatsText = ({count, unit}) => {
    return <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'flex-end'}}>

        <Typography variant="h5">{toHumanString(count)}</Typography>
        <Typography variant="caption" fontSize={14} sx={{ml: 0.5}}>{unit}</Typography>
    </Box>
}