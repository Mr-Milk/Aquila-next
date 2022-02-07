import {useDropzone} from 'react-dropzone';
import Container from "@mui/material/Container";
import {memo, useEffect, useRef, useState} from "react";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import {v4 as uuid4} from 'uuid';
import {db} from "db/schema";
import LocalRecords from "components/app/Analysis/LocalRecords";
import ClientOnly from "components/ClientOnly";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import UploadFile from "@mui/icons-material/UploadFile";
import MetaExample from "components/app/Analysis/MetaExample";
import FileExampleHelper from "components/app/Analysis/FileExampleHelper";
import LooksOne from "@mui/icons-material/LooksOne";
import LooksTwo from "@mui/icons-material/LooksTwo";
import Looks3 from "@mui/icons-material/Looks3";
import Chip from "@mui/material/Chip";
import CellInfoExample from "components/app/Analysis/CellInfoExample";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutline from "@mui/icons-material/ErrorOutline";
import * as Comlink from "comlink";


function humanFileSize(bytes, si = false, dp = 1) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }

    const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


    return bytes.toFixed(dp) + ' ' + units[u];
}

const InfoSection = () => {
    return (
        <Box component="div"
             sx={{
                 p: 2,
                 my: 4,
                 maxWidth: "500px",
                 borderRadius: 2,
                 borderStyle: 'solid',
                 borderColor: "primary.main",
             }}
        >
            <Alert severity="info" icon={false} sx={{mb: 2}}>
                <AlertTitle>File Preparation</AlertTitle>
                {`You need to prepare three files with same line number to run analysis on Aquila.
                    Each line represent a cell (single-cell data) or a dot (non single-cell data) record.
                    You can click on the ❔ to check the details.`}
            </Alert>

            <Alert severity="info" icon={false}>
                <AlertTitle>Data Privacy</AlertTitle>
                All your data will be kept on this computer, only
                when you run the analysis will send data to server. None of the information from
                ROI File will be sent.</Alert>
        </Box>
    )
}

const MemoInfoSection = memo(InfoSection);

const ShowFile = ({file, onDelete}) => {

    if (file) {
        return (
            <Chip
                label={`${file.path}, ${humanFileSize(file.size)}`}
                onDelete={onDelete}
                variant="outlined"
                color="success"
            />
        )
    } else {
        return (
            <Tooltip title={"Please upload a file"}>
                <Chip
                    label={"No File"}
                    variant="outlined"
                    color="error"
                />
            </Tooltip>
        )
    }
}

const FileUploadRegion = ({rootProps, inputProps, helperText}) => {
    return (
        <Box component="div" sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '60px',
            width: '200px',
            padding: '20px',
            borderWidth: 2,
            borderRadius: 2,
            borderColor: 'primary.main',
            borderStyle: 'dashed',
            backgroundColor: '#ffffff',
            color: "#58513e",
            outline: 'none',
            cursor: 'pointer',
            marginLeft: "10px",
            marginRight: "20px",
        }} {...rootProps}>

            <input {...inputProps} />
            <Typography component="span" sx={{
                display: 'flex',
                justifyContent: 'center'
            }}>
                <UploadFile sx={{mr: 0.5}}/>{helperText}
            </Typography>
            <Typography variant="caption" sx={{color: "darkgrey"}}>{`(Drag'n drop or click)`}</Typography>

        </Box>
    )
}


const StatusBar = ({status, text}) => {
    if (status === 'loading') {
        return <Stack direction="row" spacing={1} alignItems="center">
            <CircularProgress color="success" size={25} sx={{ml: 2}}/>
            <Typography variant={"caption"} color="green">{text}</Typography>
        </Stack>
    } else if (status === 'finished') {
        return <CheckCircleOutlineIcon color="success" sx={{ml: 2, mt: 1}}/>
    } else if (status === 'error') {
        return (
            <>
                <ErrorOutline color='error' sx={{ml: 2, mt: 1}}/>
                <Snackbar open={true} autoHideDuration={6000}>
                    <Alert severity="error" sx={{width: '100%'}}>
                        Error occurs when processing files!
                    </Alert>
                </Snackbar>
            </>

        )
    } else {
        return <></>
    }
}


const AnalysisPage = () => {

    const dataID = useRef(uuid4());
    const [loadingText, setLoadingText] = useState("Working on it");
    const [status, setStatus] = useState("waiting"); // "waiting", "loading", "finished", "error"
    const [openHelp, setOpenHelp] = useState("none"); // "meta", "info", "exp", "none"
    const [errorID, setErrorID] = useState(false);
    const [files, setFiles] = useState({
        metaFile: "",
        infoFile: "",
        expFile: "",
    })

    // workers state
    const [comlinkMessage, setComlinkMessage] = useState("");
    const comlinkWorkerRef = useRef();
    const comlinkWorkerApiRef = useRef();

    useEffect(() => {
        comlinkWorkerRef.current = new Worker(new URL('../../db/fileprocess.js', import.meta.url), {type: "module"})
        comlinkWorkerApiRef.current = Comlink.wrap(comlinkWorkerRef.current);
        console.log(comlinkWorkerRef)
        return () => {
            comlinkWorkerRef.current.terminate();
        }
    }, [])

    const checkIDExist = async (e) => {
        const exists = await db.DataRecords.get(e.target.value);
        if (exists) {
            setErrorID(true);
        } else {
            setErrorID(false);
            dataID.current = e.target.value;
        }
    }

    const onMetaDrop = (fs) => setFiles({...files, metaFile: fs[0]})
    const onInfoDrop = (fs) => setFiles({...files, infoFile: fs[0]})
    const onExpDrop = (fs) => setFiles({...files, expFile: fs[0]})

    const {
        getRootProps: metaRootProps,
        getInputProps: metaInputProps,
    } = useDropzone({multiple: false, onDrop: onMetaDrop});

    const {
        getRootProps: infoRootProps,
        getInputProps: infoInputProps,
    } = useDropzone({multiple: false, onDrop: onInfoDrop});

    const {
        getRootProps: expRootProps,
        getInputProps: expInputProps,
    } = useDropzone({multiple: false, onDrop: onExpDrop});


    const handleRun = async () => {
        setStatus("loading")
        // db.DataRecords.add({id: dataID.current, created_at: new Date().getTime()})
        try {
            setLoadingText("Processing ROI File")
            const result = await comlinkWorkerApiRef.current.roiRecord(files.metaFile, dataID.current)
            console.log(result)
            setLoadingText("Processing Cell Info File")
            const hasCellType = await comlinkWorkerApiRef.current.cellInfo(files.infoFile, dataID.current, result.roiCellCount, result.roiMapper)
            console.log(hasCellType)
            setLoadingText("Processing Exp File")
            const expResult = await comlinkWorkerApiRef.current.expInfo(files.expFile, dataID.current, result.roiCellCount, result.roiMapper)
            console.log(expResult)

            const dataRecord = {
                id: dataID.current,
                created_at: new Date().getTime(),
                has_cell_type: hasCellType,
                roi_count: result.roiCount,
                cell_count: result.cellCount,
                marker_count: expResult.markerCount,
                markers: expResult.markers,
            }

            db.DataRecords.add(dataRecord)
            setStatus("finished")

        } catch (e) {
            setStatus("error")
            setLoadingText(e)
        }


    }

    return (
        <Container component="section" maxWidth="xl" sx={{mt: 4, ml: {xs: 2}}}>

            <MemoInfoSection/>
            <Typography variant="h4" sx={{mb: 3}}>Upload Files</Typography>

            <Grid container direction="column" alignItems="top" justifyContent="flex-start" spacing={4}>
                <Grid item>
                    <div style={{display: "flex", alignItems: "center"}}>

                        <LooksOne sx={{mr: 1, color: "secondary.main"}}/>

                        <FileExampleHelper
                            title={'ROI File Example'}
                            open={(openHelp === 'meta')}
                            onClose={() => setOpenHelp("none")}
                            onClick={() => setOpenHelp("meta")}
                        >
                            <Typography sx={{mb: 2, maxWidth: "300px"}}>
                                Each line should annotate the ROI that a cell belongs to
                            </Typography>
                            <MetaExample/>
                        </FileExampleHelper>

                        <FileUploadRegion
                            rootProps={metaRootProps()}
                            inputProps={metaInputProps()}
                            helperText={"ROI File"}
                        />

                        <ShowFile file={files.metaFile}
                                  onDelete={() => setFiles({...files, metaFile: ""})}
                        />

                    </div>

                </Grid>
                <Grid item>
                    <div style={{display: "flex", alignItems: "center"}}>

                        <LooksTwo sx={{mr: 1, color: "secondary.main"}}/>

                        <FileExampleHelper
                            title={'Cell Info File Example'}
                            open={(openHelp === 'info')}
                            onClose={() => setOpenHelp("none")}
                            onClick={() => setOpenHelp("info")}
                        >
                            <Typography sx={{mb: 2, maxWidth: "400px"}}>
                                {`Must have following columns, if you are spatial transcriptome
                                data, you don't need to specify cell type. Remember the order 
                                must match exact as listed beneath.`}
                            </Typography>
                            <ul style={{lineHeight: "35px"}}>
                                <li>Cell coordination X: <Chip label="Cell X" size='small'/></li>
                                <li>Cell coordination Y: <Chip label="Cell Y" size='small'/></li>
                                <li>Cell Type <i>(Optional)</i>: <Chip label="Cell Type" size='small'/></li>
                            </ul>
                            <CellInfoExample/>
                        </FileExampleHelper>

                        <FileUploadRegion
                            rootProps={infoRootProps()}
                            inputProps={infoInputProps()}
                            helperText={"Cell Info File"}
                        />

                        <ShowFile file={files.infoFile}
                                  onDelete={() => setFiles({...files, infoFile: ""})}
                        />

                    </div>

                </Grid>
                <Grid item>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <Looks3 sx={{mr: 1, color: "secondary.main"}}/>


                        <FileExampleHelper
                            title={'Expression File Example'}
                            open={(openHelp === 'exp')}
                            onClose={() => setOpenHelp("none")}
                            onClick={() => setOpenHelp("exp")}
                        >
                            <Typography sx={{mb: 2, maxWidth: "300px"}}>
                                Each line should annotate the ROI that a cell belongs to
                            </Typography>
                            <MetaExample/>
                        </FileExampleHelper>

                        <FileUploadRegion
                            rootProps={expRootProps()}
                            inputProps={expInputProps()}
                            helperText={"Expression File"}
                        />

                        <ShowFile file={files.expFile}
                                  onDelete={() => setFiles({...files, expFile: ""})}
                        />
                    </div>

                </Grid>
            </Grid>

            <Grid container direction="row" alignItems="center">
                <Grid item>
                    <TextField
                        label="Data ID (Optional)"
                        variant="standard"
                        defaultValue={dataID.current}
                        onChange={checkIDExist}
                        error={errorID}
                        helperText={errorID ? 'ID already exists' : 'Better give it a meaningful name'}
                        sx={{width: "320px", my: 4}}
                    />
                </Grid>
                <Grid item>
                    <Button
                        onClick={handleRun}
                        variant="contained"
                        disableElevation
                        // disabled={(status !== 'waiting')}
                        sx={{ml: 2, color: "common.white"}}>
                        GO!
                    </Button>
                </Grid>
                <Grid item>
                    <StatusBar status={status} text={loadingText}/>
                </Grid>
            </Grid>

            <Typography variant="h4">Analysis Records</Typography>
            <ClientOnly>
                <LocalRecords/>
            </ClientOnly>
        </Container>
    )
}

export default AnalysisPage