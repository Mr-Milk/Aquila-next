import {
    fetcher,
    get3dDataIdURL,
    getOneRecordURL,
    getOneROIMetaURL,
    useDataInfo,
    useCellData3D,
    useROIMeta
} from "../../data/get";
import Head from "next/head";
import {Container} from "@mui/material";
import Typography from "@mui/material/Typography";
import RecordDetailsTable from "../../components/DataTable/RecordDetailsTable";
import ROITable from "../../components/DataTable/ROISelector";
import ROIMaps3D from "../../components/app/ROIViz/ROIMaps3D";
import {useEffect, useState} from "react";
import ContentBox from "../../components/Layout/ContentBox";
import Stack from "@mui/material/Stack";
import {getBBox3D} from "../../components/compute/geo";
import {parseROIDisplay} from "../../components/humanize";


const ViewerPage3D = ({id, initROI, initROIMeta, initRecordData}) => {

    const [currentROI, setROI] = useState(initROI);
    const [currentROIMeta, setROIMeta] = useState(initROIMeta);
    const updateROI = (roiID, roiMeta) => {
        setROI(roiID);
        setROIMeta(roiMeta);
    };

    const {data: recordData} = useDataInfo(id, initRecordData);
    const [bbox, setBBox] = useState({x1: 10, x2: 20, y1: 10, y2: 20, z1: 10, z2: 10})
    const {data: roiMeta} = useROIMeta(id);
    const {data: cellData} = useCellData3D(currentROI);

    useEffect(() => {
        setBBox(getBBox3D(cellData.cell_x, cellData.cell_y, cellData.cell_z))
    }, [cellData.cell_x, cellData.cell_y, cellData.cell_z])

    return (<>
        <Head>
            <title>Aquila | 3D Data Details</title>
        </Head>
        <Container maxWidth={"xl"} sx={{mt: 4, mb: 4}}>
            <Stack direction="row" justifyContent="flex-start" spacing={4}>
                <ContentBox>
                    <Typography variant={"h6"} sx={{mb: 2, mt: 1}}>Data Summary</Typography>
                    <RecordDetailsTable dataID={id}/>
                </ContentBox>
                <ContentBox>
                    <Typography variant={"h6"} sx={{mb: 2, mt: 1}}>Select ROI</Typography>
                    <ROITable roiMeta={roiMeta} updateFn={updateROI}/>
                </ContentBox>
            </Stack>
            <ROIMaps3D roiID={currentROI} roiMeta={currentROIMeta}
                       recordData={recordData} cellData={cellData}
                       bbox={bbox}
            />
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
    recordData['markers'] = recordData['markers'].slice(0, 5)

    return {
        props: {
            id: params.id,
            initRecordData: recordData,
            initROI: initROI,
            initROIMeta: parseROIDisplay(JSON.parse(roiMeta['meta'])),
        }
    }
}

export default ViewerPage3D;