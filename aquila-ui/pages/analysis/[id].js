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
import ClientOnly from "components/ClientOnly";
import Typography from "@mui/material/Typography";
import ROITable from "components/DataTable/ROISelector";
import {styled} from "@mui/styles";
import AnalysisRecordTable from "components/DataTable/AnalysisRecordTable";
import useSWR from "swr";
import {useCellDataDB, useDataInfoDB, useROIMetaDB} from "../../data/get";
import ROIMaps from "../../components/app/Analysis/ROIMaps";
import AnalysisTab from "../../components/app/View/AnalysisTab";


const promptKey = "sharingPrompt";

const ContentBox = styled('div')(
    ({theme}) => ({
        borderColor: theme.palette.divider,
        borderStyle: "solid",
        borderWidth: 1,
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
        height: theme.spacing(65),
    }))


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
    const [marker, setMarker] = useState("key");
    const changeMarker = (e, v) => setMarker(v);

    const recordData = useDataInfoDB(id);
    const roiMeta = useROIMetaDB(id);
    const cellData = useCellDataDB(currentROI);

    console.log(cellData)

    useEffect(() => {
        setROI(recordData.init_roi)
        setMarker(recordData.init_marker)
        }, [recordData.init_roi, recordData.init_marker])

    return (
        <Container maxWidth={"xl"} sx={{mt: 4, mb: 4}}>
                <Grid container flexDirection="row" justifyContent="space-around" spacing={6}>
                    <Grid item xs={12} md={4}>
                        <ClientOnly>
                            <ContentBox>
                                <Typography variant={"h6"} sx={{mb: 2, mt: 1}}>Data Summary</Typography>
                                <AnalysisRecordTable data={recordData}/>
                            </ContentBox>
                        </ClientOnly>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <ClientOnly>
                            <ContentBox>
                                <ROITable roiMeta={roiMeta} updateFn={setROI}/>
                            </ContentBox>
                        </ClientOnly>

                    </Grid>
                </Grid>
                <ROIMaps  roiID={currentROI} recordData={recordData} cellData={cellData} marker={marker} updateMarker={changeMarker}/>
                <AnalysisTab roiID={currentROI} recordData={recordData} cellData={cellData}/>
            </Container>
    )
}



const AnalysisResult = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <>
            <Head>
                <title>Aquila | Analysis Result</title>
            </Head>
            <ClientOnly>
                <PageContent id={id}/>
            </ClientOnly>
            <p>This is page from {id}</p>
            <ShareNotWorkingPrompt/>

        </>
    )
}

export default AnalysisResult;