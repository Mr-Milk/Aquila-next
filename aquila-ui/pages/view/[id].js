import {
    fetcher,
    get2dDataIdURL, getCellExpBatch,
    getOneRecordURL,
    getOneROIMetaURL,
    useCellData2D,
    useDataInfo,
    useExpData,
    useROIMeta
} from "data/get";
import {Container} from "@mui/material";
import {useCallback, useEffect, useMemo, useState} from "react";
import ROITable from "components/DataTable/ROISelector";
import RecordDetailsTable from "components/DataTable/RecordDetailsTable";
import ROIMaps from "components/app/share/ROIMaps";
import Typography from "@mui/material/Typography";
import Head from 'next/head';
import Stack from "@mui/material/Stack";
import ContentBox from "../../components/Layout/ContentBox";
import AnalysisTab from "../../components/app/View/AnalysisTab";
import {getBBox} from "../../components/compute/geo";
import {parseROIDisplay} from "../../components/humanize";
import ROIMapGallery from "../../components/app/share/ROIMapGallery";


const DetailsPage = ({id, initROI, initROIMeta, initRecordData}) => {

    const [currentROI, setROI] = useState(initROI);
    const [currentROIMeta, setROIMeta] = useState(initROIMeta);
    const [roiList, setROIList] = useState([initROI]);
    const [roiMetaList, setROIMetaList] = useState([initROIMeta]);
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

        for (let i=0; i < roiList.length; i++) {
            let ele = roiList[i];
            if (ele !== roiID) {
                newROIList.push(roiList[i])
                newROIMetaList.push(roiMetaList[i])
            }
        }

        setROIList(() => newROIList)
        setROIMetaList(() => newROIMetaList)

    };

    const {data: recordData} = useDataInfo(id, initRecordData);
    const {data: roiMeta} = useROIMeta(id);
    const {data: cellData} = useCellData2D(currentROI);

    useEffect(() => {
        setBBox(getBBox(cellData.cell_x, cellData.cell_y))
    }, [cellData.cell_x, cellData.cell_y])

    return (
        <>
            <Head>
                <title>Aquila | Data Details</title>
            </Head>
            <Container maxWidth={"xl"} sx={{ mb: 4 }}>
                <Stack direction="row" justifyContent="flex-start" spacing={4} sx={{ mt : 4 }}>
                    <ContentBox>
                        <Typography variant={"h6"} sx={{mb: 2, mt: 1}}>Data Summary</Typography>
                        <RecordDetailsTable dataID={id}/>
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
                               getCellData={useCellData2D}
                />
                <ROIMaps roiID={currentROI}
                         roiMeta={currentROIMeta}
                         recordData={recordData}
                         cellData={cellData}
                         getExpDataFn={useExpData}
                         bbox={bbox}
                />
                <AnalysisTab roiID={currentROI}
                             recordData={recordData}
                             cellData={cellData}
                             bbox={bbox}
                             getCellExpBatch={getCellExpBatch}
                />
            </Container>
        </>
    )
}

export async function getStaticPaths() {
    const data_ids = await fetcher(get2dDataIdURL);
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
        },
    }
}

export default DetailsPage;