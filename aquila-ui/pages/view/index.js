import {fetcher, getRecordsURL} from "data/get";
import {Container} from "@mui/material";
import Head from 'next/head';
import RecordsPanel from "../../components/Intro/RecordsPanel";
import Typography from "@mui/material/Typography";

const ViewPage = ({ recordData }) => {

    return (
        <>
            <Head>
                <title>Aquila | Browse</title>
                <link href="https://fonts.googleapis.com/css2?family=family=Orbitron:wght@500&display=swap" rel="stylesheet"/>
                {/*<link rel="preload" href={getRecordsURL} as="fetch" crossOrigin="anonymous"/>*/}
            </Head>
                <Container maxWidth={"xl"} sx={{mb: 4, display: 'flex', justifyContent: 'center' }}>
                    {/*<Table/>*/}
                    <Typography variant="h3" sx={{ mx: 2 }} fontFamily='Orbitron'>Aquila Datasets</Typography>
                </Container>
                <RecordsPanel data={recordData}/>
        </>

    )
}

// const Table = () => {
//     const {data, _} = useSWR(getRecordsURL, fetcher);
//
//     if (data !== undefined) {
//         return <DataTable data={data}/>
//     } else {
//         return <Skeleton variant={"rectangular"} width={200} height={20}/>
//     }
//
// }

// const RecordList = () => {
//     const {data, _} = useSWR(getRecordsURL, fetcher);
//
//     if (data !== undefined) {
//         return <DataRecordList data={data}/>
//     } else {
//         return <Skeleton variant={"rectangular"} width={200} height={20}/>
//     }
//
// }

export async function getStaticProps() {
    const data = await fetcher(getRecordsURL);

    return {
        props: {
            recordData: data.sort((a, b) => parseInt(b.year) - parseInt(a.year))
        },
        revalidate: 60
    }
}

export default ViewPage;