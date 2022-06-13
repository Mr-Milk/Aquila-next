import {useDropzone} from 'react-dropzone';
import Container from "@mui/material/Container";
import {memo, useCallback, useEffect, useRef, useState} from "react";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import {v4 as uuid4} from 'uuid';
import {db} from "db/schema";
import LocalRecords from "components/app/Analysis/LocalRecords";
import ClientOnly from "components/Layout/ClientOnly";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
    CellExpFileExample,
    CellInfoFileExample,
    ROIFileExample
} from "components/app/Analysis/FileExampleHelper";
import LooksOne from "@mui/icons-material/LooksOne";
import LooksTwo from "@mui/icons-material/LooksTwo";
import Looks3 from "@mui/icons-material/Looks3";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutline from "@mui/icons-material/ErrorOutline";
import * as Comlink from "comlink";
import {humanFileSize} from "../../components/humanize";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import Head from "next/head";
import sum from 'loadsh/sum';
import Grid from "@mui/material/Grid";
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import HelpOutline from "@mui/icons-material/HelpOutline";
import FolderZipOutlinedIcon from '@mui/icons-material/FolderZipOutlined';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import PostAddRoundedIcon from '@mui/icons-material/PostAddRounded';
import CircleIcon from '@mui/icons-material/Circle';
import {createExample} from "../../db/createExample";


const InfoSection = memo(
    function InfoSection() {

        const [openExampleExistWarning, setOpen] = useState(false);

        return (
            <Box component="div"
                 sx={{
                     mt: 2,
                     mb: 4,
                 }}
            >
                <Alert severity="info" icon={false} sx={{mb: 2}}>
                    <AlertTitle>File Preparation</AlertTitle>
                    <ul>
                        <li>
                            {`Prepare three files with same number of lines.`}
                        </li>
                        <li>
                            {`Each line represent a cell (single-cell data) or a dot (non single-cell data) record.`}
                        </li>
                        <li>
                            {`Click on the `}{<HelpOutline fontSize="inherit"
                                                           color="action"/>}{` to check the details.`}
                        </li>
                    </ul>
                </Alert>

                <Alert severity="info" icon={false} sx={{mb: 2}}>
                    <AlertTitle>Data Privacy</AlertTitle>
                    <ul>
                        <li>
                            {`All your data will be kept on this computer.`}
                        </li>
                        <li>
                            {`If you run the analysis, only cell location and cell expression data will be sent to the remote server.`}
                        </li>
                        <li>
                            {`Our server does not preserve any user data.`}
                        </li>
                    </ul>
                </Alert>

                <Grid container direction="row" spacing={2}>
                    <Grid item>
                        <Button
                            variant="outlined"
                            disableElevation
                            sx={{textTransform: 'none'}}
                            href="/example_data.zip"
                            startIcon={<FolderZipOutlinedIcon/>}
                        >Download Example Files</Button>
                    </Grid>

                    <Grid item>
                        <Button
                            variant="outlined"
                            disableElevation
                            sx={{textTransform: 'none'}}
                            startIcon={<AddCircleOutlineRoundedIcon/>}
                            onClick={async () => {
                                const exists = await db.DataRecords.get("Example Data (mini seqFISH data)");
                                if (!exists) {
                                    createExample()
                                } else {
                                    setOpen(true)
                                }
                            }}
                        >Create Example Record</Button>
                        <Snackbar open={openExampleExistWarning} autoHideDuration={2000} onClose={() => setOpen(false)}>
                            <Alert onClose={() => setOpen(false)} severity="warning" sx={{width: '100%'}}>
                                The example is already in your record!
                            </Alert>
                        </Snackbar>
                    </Grid>
                </Grid>

            </Box>
        )
    })

const FileUploadRegion = ({startIcon, exampleHelper, file, onDeleteFile, rootProps, inputProps, helperText}) => {
    return (
        <Box>
            <Stack direction="row" alignItems="center" spacing={0.5}>
                {startIcon}
                {exampleHelper}
                <Tooltip title={"Please upload a file"} disableHoverListener={!!file}>
                    <Chip
                        size="small"
                        label={file ? `${file.path}, ${humanFileSize(file.size)}` : "No File"}
                        variant="outlined"
                        color={file ? "success" : "error"}
                        onDelete={file ? onDeleteFile : null}
                    />
                </Tooltip>
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="center" sx={{
                mt: 1,
                p: 6,
                borderWidth: 2,
                borderRadius: 2,
                borderColor: 'primary.main',
                borderStyle: 'dashed',
                color: "#58513e",
                outline: 'none',
                cursor: 'pointer',
            }} {...rootProps}>

                <input {...inputProps} />
                <PostAddRoundedIcon fontSize="large" sx={{mr: 1}}/>
                <Typography component="span" sx={{
                    display: 'flex',
                    flexDirection: "column",
                    justifyContent: 'flex-start',
                    overflow: 'hidden',
                }}>
                    {helperText}
                    <Typography variant="body1" sx={{
                        color: "darkgrey",
                        display: {xs: 'none', sm: 'block'}
                    }}>{`Drop here or click`}</Typography>
                    <Typography variant="body1" sx={{
                        color: "darkgrey",
                        display: {xs: 'block', sm: 'none'}
                    }}>{`Press to select`}</Typography>
                </Typography>
            </Stack>
        </Box>
    )
}


const DotProgress = ({step, total}) => {
    return (
        <div style={{display: 'inline-block'}}>
            {
                [...Array(total).keys()].map((i) => {
                    // if finished, show finished icon
                    if ((i + 1) < step) {
                        return <CheckCircleOutlineIcon color="success" key={i}/>
                    }
                    // if working on it, show orange circle
                    else if ((i + 1) === step) {
                        return <CircleIcon color={"warning"} key={i}/>
                    }
                    // if having reach the step yet, show gray circle
                    else {
                        return <CircleIcon color={"disabled"} key={i}/>
                    }
                })
            }
        </div>
    )
}

const stepText = {
    1: "Splitting ROI",
    2: "Reading cell location and cell type",
    3: "Parsing expression data, may take a while",
    4: "Finished"
}

const StatusBar = ({step}) => {
    // if it's not running don't show status bar
    if (step === 0) {
        return null
    }
    // if it's error, ask user to check input
    if (step === -1) {
        return <Alert severity="error" sx={{mb: 4, maxWidth: '500px'}}>Error occurs when processing files! Check your
            input files.</Alert>
    }
    // if running, show the status bar
    return (
        <Stack direction="row" spacing={2} alignItems="center" sx={{mb: 2}}>
            <Stack>
                <DotProgress step={step} total={3}/>
                <Typography color={step === 4 ? "green" : "darkorange"}>{stepText[step]}</Typography>
            </Stack>
            <CircularProgress color="success" sx={{display: step === 4 ? "none" : "block"}}/>
        </Stack>
    )
}

const dataIDHelperText = (error) => {

    if (error === 0) {
        return 'Better use a meaningful name for future reference'
    } else if (error === 1) {
        return 'ID already exists'
    } else {
        return 'ID cannot be empty'
    }
}


const AnalysisPage = () => {

    const [dataID, setDataID] = useState(uuid4().slice(0, 8));
    const [processStep, setProcessStep] = useState(0);
    const [allowStart, setAllowStart] = useState(false);
    const [errorID, setErrorID] = useState(0); // 0: correct 1: duplicated, 2: empty
    const [files, setFiles] = useState({
        metaFile: "",
        infoFile: "",
        expFile: "",
    })

    const handleReset = () => {
        setDataID(uuid4().slice(0, 8))
        setProcessStep(0)
        setAllowStart(false)
        setErrorID(false)
        setFiles({
            metaFile: "",
            infoFile: "",
            expFile: "",
        })
    }

    // const [isSingleCell, setIsSingleCell] = useState(true);
    // const handleSwitch = (e) => setIsSingleCell(e.target.checked)

    // workers state
    // const [comlinkMessage, setComlinkMessage] = useState("");
    const comlinkWorkerRef = useRef();
    const comlinkWorkerApiRef = useRef();

    useEffect(() => {
        comlinkWorkerRef.current = new Worker(new URL('../../db/fileprocess.js', import.meta.url), {type: "module"})
        comlinkWorkerApiRef.current = Comlink.wrap(comlinkWorkerRef.current);
        //console.log(comlinkWorkerRef)
        return () => {
            comlinkWorkerRef.current.terminate();
        }
    }, [])

    const checkReady = useCallback(() => {
        let fileStatus = sum(Object.values(files).map((i) => i === "" ? 0 : 1));
        if (fileStatus === 3) {
            setAllowStart(true)
        }
    }, [files])

    useEffect(() => checkReady(), [checkReady, files])

    const checkIDValidate = async (e) => {
        let v = e.target.value;
        setDataID(v);
        if (v.length === 0) {
            setErrorID(2);
            setAllowStart(false);
        } else {
            const exists = await db.DataRecords.get(e.target.value);
            if (exists) {
                setErrorID(1);
                setAllowStart(false);
            } else {
                setErrorID(0);
                checkReady();
            }
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
        setAllowStart(false)
        // db.DataRecords.add({id: dataID.current, created_at: new Date().getTime()})
        try {
            setProcessStep(1)
            const result = await comlinkWorkerApiRef.current.roiRecord(files.metaFile, dataID)
            //console.log(result)
            setProcessStep(2)
            const hasCellType = await comlinkWorkerApiRef.current.cellInfo(files.infoFile, dataID, result.roiCellCount, result.roiMapper)
            //console.log(hasCellType)
            setProcessStep(3)
            const expResult = await comlinkWorkerApiRef.current.expInfo(files.expFile, dataID, result.roiCellCount, result.roiMapper)
            //console.log(expResult)

            const dataRecord = {
                id: dataID,
                created_at: new Date().getTime(),
                has_cell_type: hasCellType,
                roi_count: result.roiCount,
                cell_count: result.cellCount,
                marker_count: expResult.markerCount,
                markers: expResult.markers,
                is_single_cell: true,
            }

            db.DataRecords.add(dataRecord)
            setProcessStep(4)
            setDataID(uuid4().slice(0, 8))
            setAllowStart(true)

        } catch (e) {
            setProcessStep(-1)
            checkReady()
        }


    }

    return (
        <>
            <Head>
                <title>Aquila | Analysis</title>
            </Head>
            <Container component="section" maxWidth="xl" sx={{mt: 4}}>

                <Typography variant="h4" sx={{mb: 3}} fontFamily='Plus Jakarta Sans'>Submit Files</Typography>
                <InfoSection/>
                <Grid container direction="row" alignItems="top" justifyContent="flex-start" spacing={4}>
                    <Grid item>
                        <FileUploadRegion
                            startIcon={<LooksOne color="secondary"/>}
                            exampleHelper={<ROIFileExample/>}
                            file={files.metaFile}
                            onDeleteFile={() => setFiles({...files, metaFile: ""})}
                            rootProps={metaRootProps()}
                            inputProps={metaInputProps()}
                            helperText={"ROI File"}
                        />
                    </Grid>

                    <Grid item>
                        <FileUploadRegion
                            startIcon={<LooksTwo color="secondary"/>}
                            exampleHelper={<CellInfoFileExample/>}
                            file={files.infoFile}
                            onDeleteFile={() => setFiles({...files, infoFile: ""})}
                            rootProps={infoRootProps()}
                            inputProps={infoInputProps()}
                            helperText={"Cell Info File"}
                        />
                    </Grid>

                    <Grid item>
                        <FileUploadRegion
                            startIcon={<Looks3 color="secondary"/>}
                            exampleHelper={<CellExpFileExample/>}
                            file={files.expFile}
                            onDeleteFile={() => setFiles({...files, expFile: ""})}
                            rootProps={expRootProps()}
                            inputProps={expInputProps()}
                            helperText={"Expression File"}
                        />
                    </Grid>


                </Grid>
                <Grid container direction="row" alignItems="center" justifyContent="flex-start" spacing={2}
                      sx={{my: 4}}>
                    <Grid item>
                        <TextField
                            label="Data ID (Optional)"
                            variant="standard"
                            value={dataID}
                            onChange={checkIDValidate}
                            error={errorID !== 0}
                            helperText={dataIDHelperText(errorID)}
                            sx={{maxWidth: "300px"}}
                        />
                    </Grid>
                    <Grid item>
                        {
                            allowStart ? <Button
                                onClick={handleRun}
                                variant="contained"
                                disableElevation
                                color="success"
                                sx={{color: "common.white"}}
                                startIcon={<BoltRoundedIcon/>}
                            >
                                Start
                            </Button> : <Tooltip title={"Please upload required files"}><span>
                             <Button
                                 onClick={handleRun}
                                 variant="contained"
                                 disableElevation
                                 color="success"
                                 disabled={true}
                                 sx={{color: "common.white"}}
                                 startIcon={<BoltRoundedIcon/>}
                             >
                                Start
                            </Button>
                            </span></Tooltip>

                        }
                    </Grid>
                    <Grid item>
                        <Button onClick={handleReset}
                                variant="contained"
                                color="error"
                                disableElevation
                                sx={{color: "common.white"}}
                                startIcon={<AutorenewIcon/>}
                        >Reset</Button>
                    </Grid>
                </Grid>

                <StatusBar step={processStep}/>

                <Typography variant="h4" fontFamily='Plus Jakarta Sans'>Finished Analysis</Typography>
                <ClientOnly>
                    <LocalRecords/>
                </ClientOnly>
            </Container>
        </>
    )
}

export default AnalysisPage