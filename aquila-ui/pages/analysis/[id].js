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
import ROIMaps from "../../components/app/share/ROIMaps";
import AnalysisTab from "../../components/app/View/AnalysisTab";
import ContentBox from "../../components/Layout/ContentBox";
import RecordDetailsTable from "../../components/DataTable/RecordDetailsTable";
import Stack from "@mui/material/Stack";
import {parseROIDisplay} from "../../components/humanize";
import {getBBox} from "../../components/compute/geo";


const promptKey = "sharingPrompt";


const ShareNotWorkingPrompt = () => {

    const [open, setOpen] = useState(false)
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
        open={open}
        autoHideDuration={10000}
        onClose={() => setOpen(false)}
        color="success"
        message={"This content only available on your local computer, sharing the link won't work."}
        action={
            <ClientOnly>
                <Button onClick={handleNotShown}>
                    {"Don't show again"}
                </Button>
                <IconButton onClick={() => setOpen(false)}>
                    <CloseIcon/>
                </IconButton>
            </ClientOnly>
        }
    />

}


const PageContent = ({ id }) => {

    const [currentROI, setROI] = useState("key");
    const [currentROIMeta, setROIMeta] = useState("key");
    const updateROI = (roiID, roiMeta) => {
        setROI(roiID);
        setROIMeta(roiMeta);
    };
    const [bbox, setBBox] = useState({x1: 10, x2: 20, y1: 10, y2: 20})

    const recordData = useDataInfoDB(id);
    const roiMeta = useROIMetaDB(id);
    const cellData = useCellDataDB(currentROI);


    useEffect(() => {
        setROI(recordData.init_roi)
        setROIMeta(parseROIDisplay(JSON.parse(roiMeta[0]['meta'])))
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
                <ROIMaps roiID={currentROI} roiMeta={currentROIMeta}
                         recordData={recordData} cellData={cellData}
                         getExpDataFn={useExpDataDB} bbox={bbox}/>
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
    console.log(router.query)
    const { id } = router.query;

    if (!ready) return null
    return (
        <>
            <Head>
                <title>Aquila | Result {id}</title>
            </Head>
            <ClientOnly>
                <PageContent id={id}/>
            </ClientOnly>
            <ShareNotWorkingPrompt/>
        </>
    )
}

export default AnalysisResult;