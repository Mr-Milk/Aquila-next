import {useRouter} from "next/router";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import Button from "@mui/material/Button";
import {useEffect, useRef, useState} from "react";
import {db} from "db/schema";
import {useLiveQuery} from "dexie-react-hooks";
import Head from "next/head";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import ClientOnly from "components/Layout/ClientOnly";
import Typography from "@mui/material/Typography";
import ROITable from "components/DataTable/ROISelector";
import {styled} from "@mui/styles";
import AnalysisRecordTable from "components/DataTable/AnalysisRecordTable";
import useSWR from "swr";
import {getCellExpBatchDB, useCellDataDB, useDataInfoDB, useExpDataDB, useROIMetaDB} from "../../data/get";
import ROIMaps from "../../components/app/ROIViz/ROIMaps";
import AnalysisTab from "../../components/app/share/AnalysisTab";
import ContentBox from "../../components/Layout/ContentBox";
import RecordDetailsTable from "../../components/DataTable/RecordDetailsTable";
import Stack from "@mui/material/Stack";
import {parseROIDisplay} from "../../components/humanize";
import {getBBox} from "../../components/compute/geo";
import ROIMapGallery from "../../components/app/ROIViz/ROIMapGallery";
import Alert from "@mui/material/Alert";
import {SnackbarContent} from "@mui/material";


const promptKey = "sharingPrompt";


const ShareNotWorkingPrompt = () => {

    const [open, setOpen] = useState(false)
    const handleClose = () => setOpen(false)
    const handleNotShown = () => {
        setOpen(false)
        localStorage.setItem(promptKey, "false")
    }

    useEffect(() => {
        if (localStorage.getItem(promptKey) !== "false") {
            setOpen(true)
        }
    }, [])

    return <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={open}
        autoHideDuration={100000}
        onClose={handleClose}
        message={"This content only available on your local computer, sharing the link won't work."}
        action={
            <>
                <Button onClick={handleNotShown} size="small">
                    {"Don't show again"}
                </Button>
                <IconButton onClick={handleClose} color="primary">
                    <CloseIcon/>
                </IconButton>
            </>}
    />

}


const PageContent = ({id}) => {

    const [currentROI, setROI] = useState("key");
    const [currentROIMeta, setROIMeta] = useState([]);
    const [roiList, setROIList] = useState([]);
    const [roiMetaList, setROIMetaList] = useState([]);
    const [bbox, setBBox] = useState({x1: 10, x2: 20, y1: 10, y2: 20})

    const updateROI = (roiID, roiMeta) => {
        let update = true;
        setROI(roiID);
        setROIMeta(roiMeta);
        setROIList((prev) => {
            update = prev.includes(roiID)
            if (update) {
                return prev
            } else {
                return [...prev, roiID]
            }
        })
        setROIMetaList((prev) => {
            if (update) {
                return prev
            } else {
                return [...prev, roiMeta]
            }
        })
    };
    const setCurrentROI = (roiID, roiMeta) => {
        setROI(roiID);
        setROIMeta(roiMeta);
    };
    const deleteROI = (roiID) => {

        let newROIList = [];
        let newROIMetaList = [];

        for (let i = 0; i < roiList.length; i++) {
            let ele = roiList[i];
            if (ele !== roiID) {
                newROIList.push(roiList[i])
                newROIMetaList.push(roiMetaList[i])
            }
        }

        setROIList(() => newROIList)
        setROIMetaList(() => newROIMetaList)

    };

    const recordData = useDataInfoDB(id);
    const roiMeta = useROIMetaDB(id);
    const {data: cellData} = useCellDataDB(currentROI);

    useEffect(() => {
        let initROI = recordData.init_roi;
        let initROIMeta = parseROIDisplay(JSON.parse(roiMeta[0]['meta']));
        setROI(initROI)
        setROIMeta(initROIMeta)
        setROIList([initROI])
        setROIMetaList([initROIMeta])
    }, [recordData.init_roi, roiMeta])

    useEffect(() => {
        setBBox(getBBox(cellData.cell_x, cellData.cell_y))
    }, [cellData.cell_x, cellData.cell_y])

    return (
        <Container maxWidth={"xl"} sx={{mt: 4, mb: 4}}>
            <Stack direction="row" justifyContent="flex-start" spacing={4}>
                <ContentBox>
                    <Typography variant={"h6"} sx={{mb: 2, mt: 1}}>Data Summary</Typography>
                    <AnalysisRecordTable data={recordData}/>
                </ContentBox>
                <ContentBox>
                    <Typography variant={"h6"} sx={{mb: 2, mt: 1}}>Select ROI</Typography>
                    <ROITable roiMeta={roiMeta} updateFn={updateROI}/>
                </ContentBox>
            </Stack>
            <ROIMapGallery roiList={roiList}
                           roiMetaList={roiMetaList}
                           setCurrentROI={setCurrentROI}
                           deleteROI={deleteROI}
                           getCellData={useCellDataDB}
            />
            <ROIMaps roiID={currentROI}
                     roiMeta={currentROIMeta}
                     recordData={recordData}
                     cellData={cellData}
                     getExpDataFn={useExpDataDB}
                     bbox={bbox}
            />
            <AnalysisTab roiID={currentROI}
                         recordData={recordData}
                         cellData={cellData}
                         bbox={bbox}
                         getCellExpBatch={getCellExpBatchDB}
            />
        </Container>
    )
}


const AnalysisResult = () => {
    const router = useRouter();
    const [ready, setReady] = useState(false)

    useEffect(() => {
        if (router.isReady) {
            setReady(true)
        }
    }, [router.isReady])
    //console.log(router.query)
    const {id} = router.query;

    if (!ready) return null
    return (
        <>
            <Head>
                <title>Aquila Result | {id}</title>
            </Head>
            <ClientOnly>
                <PageContent id={id}/>
                <ShareNotWorkingPrompt/>
            </ClientOnly>
        </>
    )
}

export default AnalysisResult;