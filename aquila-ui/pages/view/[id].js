import {fetcher, getDataIdURL, getOneRecordURL, getROIMetaURL} from "@/data/get";
import {SWRConfig} from "swr";
import {Container, Grid} from "@mui/material";
import {styled} from "@mui/styles";
import {useState} from "react";
import ROITable from "@/components/DataTable/ROISelector";
import RecordDetailsTable from "@/components/DataTable/RecordDetailsTable";
import ROIMaps from "@/components/app/View/ROIMaps";
import Typography from "@mui/material/Typography";
import ClientOnly from "@/components/ClientOnly";
import Head from 'next/head';
import AnalysisTab from "@/components/app/View/AnalysisTab";


// export const ROIContext = createContext({value: "", loadROI: ""});

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


const DetailsPage = ({id, init_roi, fallback}) => {

    const [currentROI, setROI] = useState(init_roi);

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
                                <ROITable dataID={id} updateFn={setROI}/>
                            </ContentBox>
                        </ClientOnly>

                    </Grid>
                </Grid>


                {/*<ROIContext.Provider value={{*/}
                {/*    currentROI, loadROI: currentValue => {setROI(currentValue)}*/}
                {/*}}>*/}


                {/*</ROIContext.Provider>*/}
                <ROIMaps dataID={id} roiID={currentROI}/>
                <AnalysisTab dataID={id} roiID={currentROI}/>
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
    const data_records = await fetcher(RecordURL);
    const roi_info = await fetcher(ROIMetaURL);
    const init_roi = roi_info[0]['roi_id'];

    const fallbackData = {};
    fallbackData[`${RecordURL}`] = data_records
    fallbackData[`${ROIMetaURL}`] = roi_info

    return {
        props: {
            id: params.id,
            init_roi: init_roi,
            fallback: fallbackData
        }
    }
}

export default DetailsPage;