import {
    fetcher,
    getDataIdURL,
    getOneRecordURL,
    getROIMetaURL,
    useCellData,
    useDataInfo,
    useROIMeta
} from "data/get";
import useSWR, {SWRConfig} from "swr";
import {Container, Grid} from "@mui/material";
import {styled} from "@mui/styles";
import {useMemo, useState} from "react";
import ROITable from "components/DataTable/ROISelector";
import RecordDetailsTable from "components/DataTable/RecordDetailsTable";
import ROIMaps from "components/app/View/ROIMaps";
import Typography from "@mui/material/Typography";
import ClientOnly from "components/ClientOnly";
import Head from 'next/head';
import AnalysisTab from "components/app/View/AnalysisTab";


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



const DetailsPage = ({ id, initROI, initMarker, fallback }) => {

    const [currentROI, setROI] = useState(initROI);
    const [marker, setMarker] = useState(initMarker);

    const changeMarker = (e, v) => setMarker(v);

    const {data: recordData} = useDataInfo(id);
    const {data: roiMeta} = useROIMeta(id);
    const {data: cellData} = useCellData(currentROI);


    return (
        <SWRConfig value={{fallback}}>
            <Head>
                <title>Aquila | Data Details</title>
            </Head>
            <Container maxWidth={"xl"} sx={{mt: 4, mb: 4}}>
                <Grid component={"div"} container flexDirection="row" justifyContent="space-around" spacing={6}>
                    <Grid component={"div"} item xs={12} md={4}>
                        <ClientOnly>
                            <ContentBox>
                                <Typography variant={"h6"} sx={{mb: 2, mt: 1}}>Data Summary</Typography>
                                <RecordDetailsTable dataID={id}/>
                            </ContentBox>
                        </ClientOnly>
                    </Grid>
                    <Grid component={"div"} item xs={12} md={8}>
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
        </SWRConfig>
    )
}

export async function getStaticPaths() {
    const data_ids = await fetcher(getDataIdURL);
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
    const ROIMetaURL = `${getROIMetaURL}/${params.id}`;

    const recordData = await fetcher(RecordURL);
    const roiMeta = await fetcher(ROIMetaURL);

    const initROI = roiMeta[0]['roi_id'];
    const initMarker = recordData.markers[0];

    const fallbackData = {};
    fallbackData[`${RecordURL}`] = recordData
    fallbackData[`${ROIMetaURL}`] = roiMeta

    return {
        props: {
            id: params.id,
            initROI: initROI,
            initMarker: initMarker,
            fallback: fallbackData
        }
    }
}

export default DetailsPage;