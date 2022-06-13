import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import {memo, startTransition, useState} from "react";
import Link from "../Link";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from "@mui/material/IconButton";
import DownloadIcon from '@mui/icons-material/Download';
import {DimChip, JournalText, MoleculeChip, SpeciesChip, StatsText, TechChip} from "./Cards";
import CreateNewFolderRoundedIcon from '@mui/icons-material/CreateNewFolderRounded';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import Tooltip from "@mui/material/Tooltip";
import DownloadFab from "../app/View/DownloadFab";
import {ImBoxAdd, ImBoxRemove, ImDownload} from 'react-icons/im';
import {CgPlayListRemove, CgPlayListAdd} from 'react-icons/cg';
import PageviewOutlinedIcon from '@mui/icons-material/PageviewOutlined';


const DataRecordCard = ({record, addDownloadList, removeDownloadList}) => {

    const [added, setAdded] = useState(false);

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

    return <Grid item xs={4} md={6}>
        <Container maxWidth="400px">
            <Paper square elevation={0} sx={{
                my: 2,
                pt: 2,
                pb: 1,
                px: 4,
                border: 1,
                borderRadius: '8px',
                borderColor: 'divider',
                '&:hover': {
                    backgroundColor: 'rgba(255,204,128,0.05)',
                    transition: 'background 0.3s'
                }
            }}>
                <Grid container direction="row" spacing={2} justifyContent="flex-start">
                    <Grid item>
                        <SpeciesChip species={record.species}/>
                    </Grid>
                    <Grid item>
                        <Chip size="small" label={tissue} variant="outlined"
                            //sx={{color: '#ec407a', borderColor: '#ec407a'}}
                        ></Chip>
                    </Grid>
                    <Grid item>
                        <Chip size="small" label={disease} variant="outlined"
                              color={(disease === 'Normal') ? 'success' : 'error'}></Chip>
                    </Grid>
                    <Grid item>

                    </Grid>
                </Grid>

                <Stack direction="row" justifyContent="space-between" spacing={4} sx={{my: 2}}>
                    <StatsText count={record.cell_count} unit={record.is_single_cell ? 'Cells' : 'Spots'}/>
                    <StatsText count={record.marker_count} unit={record.molecule === 'RNA' ? 'Genes' : 'Markers'}/>
                    <StatsText count={record.roi_count} unit={record.roi_count === 1 ? 'ROI' : 'ROIs'}/>
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
                    {
                        record.has_cell_type ? <Grid item>
                            <Chip label={'Cell Type'}
                                  icon={<CheckIcon sx={{"&&": {color: "#00896C"}}}/>}
                                  variant="filled"
                                  size="small"
                            />
                        </Grid> : <></>
                    }

                </Grid>

                <Divider sx={{my: 1}}/>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" alignItems="center" spacing={1}>

                        <Link href={record.is_3d ? `/view3d/${record.data_uuid}` : `/view/${record.data_uuid}`}>
                            <Button
                                size="small"
                                startIcon={<PageviewOutlinedIcon/>}
                                color="primary"
                                //sx={{ mr: 1 }}
                            >
                                View
                            </Button>
                        </Link>

                        <Tooltip title={"Download"}>
                            <IconButton
                                size="small"
                                href={`https://api.aquila.cheunglab.org/static/${record.data_uuid}.zip`}
                                color="primary"
                                //download={`${record.technology}-${record.is_3d ? '3D' : '2D'}-${record.species}-${record.tissue}-${record.disease}-${record.cell_count}x${record.marker_count}x${record.roi_count}.zip`}
                            >
                                <ImDownload/>
                            </IconButton>
                        </Tooltip>
                        {added ? <Tooltip title={"Remove from download list"}>
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => {
                                        removeDownloadList(record.data_uuid)
                                        setAdded(false)
                                    }}>
                                    <ImBoxRemove/>
                                </IconButton>
                            </Tooltip> :
                            <Tooltip title={"Add to download list"}>
                                <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => {
                                        addDownloadList(record.data_uuid)
                                        setAdded(true)
                                    }}>
                                    <ImBoxAdd/>
                                </IconButton>
                            </Tooltip>
                        }
                    </Stack>
                    <JournalText record={record}/>

                </Stack>
            </Paper>
        </Container>
    </Grid>
}

const MemoDataRecordCard = memo(DataRecordCard);

const DataRecordList = memo(function DataRecordList({data}) {

    const [downloadList, setDownloadList] = useState([]);

    const addDownloadList = (id) => {
        startTransition(() => {
            let newList = new Set([...downloadList, id])
            setDownloadList([...newList])
        })
    }

    const removeDownloadList = (id) => {
        startTransition(() => {
            let newList = downloadList.filter((i) => i !== id)
            setDownloadList(newList)
        })
    }

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
                    {data.map((r) => (
                        <MemoDataRecordCard record={r}
                                            addDownloadList={addDownloadList}
                                            removeDownloadList={removeDownloadList}
                                            key={r.data_uuid}/>
                    ))}
                </Grid>
        }
        <DownloadFab downloadList={downloadList}/>
    </Container>
})

export default DataRecordList;