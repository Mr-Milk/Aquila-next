import {fetcher, getRecordsURL} from "@data/get";
import useSWR, {SWRConfig} from "swr";
import DataTable from "@components/DataTable/RecordsTable";
import {Container, Skeleton} from "@mui/material";
import Head from 'next/head';

const ViewPage = ({fallback}) => {
    return (
        <>
            <Head>
                <title>Aquila | Browse</title>
                <link rel="preload" href={getRecordsURL} as="fetch" crossOrigin="anonymous"/>
            </Head>
            <SWRConfig value={{fallback}}>
                <Container maxWidth={"xl"} sx={{mt: 4, mb: 4}}>
                    <Table/>
                </Container>

            </SWRConfig>
        </>

)
}

const Table = () =>
    {
        const {data, _} = useSWR(getRecordsURL, fetcher);

        if (data != undefined) {
            return <DataTable data={data}/>
        } else {
            return <Skeleton variant={"rectangular"} width={200} height={20}></Skeleton>
        }

    }

export async function getStaticProps()
    {
        const data = await fetcher(getRecordsURL);

        const fallbackData = {};
        fallbackData[`${getRecordsURL}`] = data

        console.log(fallbackData)

        return {
            props: {
                fallback: fallbackData
            }
        }
    }

export default ViewPage;