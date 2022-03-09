import {
    fetcher,
    get3dDataIdURL,
    getOneRecordURL,
    getOneROIMetaURL,
    useCellData3D,
    useROIMeta
} from "../../data/get";
import Head from "next/head";
import {Container} from "@mui/material";
import Typography from "@mui/material/Typography";
import RecordDetailsTable from "../../components/DataTable/RecordDetailsTable";
import ROITable from "../../components/DataTable/ROISelector";
import ROIMaps3D from "../../components/app/View/ROIMaps3D";
import {useState} from "react";
import ContentBox from "../../components/ContentBox";
import Stack from "@mui/material/Stack";


const ViewerPage3D = ({id, initROI, initROIMeta, recordData}) => {

    const [currentROI, setROI] = useState(initROI);
    const [currentROIMeta, setROIMeta] = useState(initROIMeta);
    const updateROI = (roiID, roiMeta) => {
        setROI(roiID);
        setROIMeta(roiMeta);
    };
    // const {data: recordData} = useDataInfo(id);
    const {data: roiMeta} = useROIMeta(id);
    const {data: cellData} = useCellData3D(currentROI);

    return (<>
        <Head>
            <title>Aquila | Data Details</title>
        </Head>
        <Container maxWidth={"xl"} sx={{mt: 4, mb: 4}}>
            <Stack direction="row" justifyContent="flex-start" spacing={4}>
                <ContentBox>
                    <Typography variant={"h6"} sx={{mb: 2, mt: 1}}>Data Summary</Typography>
                    <RecordDetailsTable dataID={id}/>
                </ContentBox>
                <ContentBox>
                    <ROITable roiMeta={roiMeta} updateFn={updateROI}/>
                </ContentBox>
            </Stack>
            <ROIMaps3D roiID={currentROI} roiMeta={currentROIMeta} recordData={recordData} cellData={cellData}/>
        </Container>
    </>)
}

export async function getStaticPaths() {
    const data_ids = await fetcher(get3dDataIdURL);
    const allIDs = data_ids.map(data_id => {
        return {
            params: {
                id: data_id
            }
        }
    })
    return {
        paths: allIDs,
        fallback: false,
    }
}


export async function getStaticProps({params}) {
    const RecordURL = `${getOneRecordURL}/${params.id}`;
    const ROIMetaURL = `${getOneROIMetaURL}/${params.id}`;

    const recordData = await fetcher(RecordURL);
    const roiMeta = await fetcher(ROIMetaURL);

    const initROI = roiMeta['roi_id'];
    let initROIMeta = []
    Object.entries(JSON.parse(roiMeta['meta'])).map((e) => {
        if ((e[0] !== 'data_uuid') && (e[0] !== 'roi_id')) {
            initROIMeta.push(e[1])
        }
    });
    initROIMeta = initROIMeta.join(" | ")

    return {
        props: {
            id: params.id,
            recordData: recordData,
            initROI: initROI,
            initROIMeta: initROIMeta,
        }
    }
}

export default ViewerPage3D;