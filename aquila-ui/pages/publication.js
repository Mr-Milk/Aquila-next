import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import {fetcher, getRecordsURL} from "../data/get";
import groupBy from 'loadsh/groupBy';
import uniq from 'loadsh/uniq';
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import {memo, startTransition, useState} from "react";
import Fuse from "fuse.js";
import Search from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import OneItemCenter from "../components/Layout/OneItemCenter";
import Grid from "@mui/material/Grid";


const FieldItem = ({title, content}) => (
    <Stack direction="row" spacing={1}>
        <Typography fontWeight="500">{title}</Typography>
        <Typography>{content}</Typography>
    </Stack>
)

const DataSetButton = ({name, href}) => (
    <Button
        style={{textTransform: 'none'}}
        href={href}
        variant="outlined"
        disableElevation
        size="small"
        color="secondary"
    >
        {name}
    </Button>
)


const PubCard = ({record}) => {
    return (
        <Grid item>
            <Box sx={{
                border: 1,
                borderColor: 'divider',
                borderRadius: '5px',
                p: 3
            }}>
                {/*Title*/}
                <Link sx={{textDecoration: 'none'}} href={record.url} target="blank_">
                    <Typography variant="h6" color="grass">{record.title}</Typography>
                </Link>
                {/*Journal and Year*/}
                <Typography fontStyle="italic" color="gray">{`${record.journal}, ${record.year}`}</Typography>
                {/*Other fields*/}
                <FieldItem title={"Technology:"} content={record.technology.join(", ")}/>
                <FieldItem title={"Species:"} content={record.species.join(", ")}/>
                <FieldItem title={"Tissue:"} content={record.tissue.join(", ")}/>
                <FieldItem title={"Disease:"} content={record.disease.join(", ")}/>
                <Stack direction="row" spacing={2} sx={{mt: 1}}>
                    {
                        (record.data_uuids.length === 1) ?
                            <DataSetButton name={"Dataset"} href={`/view/${record.data_uuids[0]}`}/> :
                            record.data_uuids.map((id, i) => (
                                <DataSetButton key={i} name={`Dataset ${i + 1}`} href={`/view/${id}`}/>
                            ))
                    }
                </Stack>
            </Box>
        </Grid>
    )
}

const MemoPubCard = memo(PubCard);


const SearchPubs = ({data, updateDataFn}) => {

    const fuse = new Fuse(data, {
        keys: [
            'species',
            'technology',
            'disease',
            'tissue',
            'title',
            'journal',
            'year'
        ],
        threshold: 0.2
    })

    const runSearch = (keyword) => {
        startTransition(() => {
            if (keyword.length > 0) {
                const result = fuse.search(keyword).map((r) => {
                    return r.item
                });
                updateDataFn(result)
            } else {
                updateDataFn(data)
            }
        })

    }

    return (
        <Stack direction="row" alignItems="flex-end"
               sx={{
                   width: '100%',
                   px: 4,
                   my: 2,
               }}
        >
            <Search sx={{mr: 1}}/>
            <TextField fullWidth
                       variant="standard"
                       placeholder={"Search publications"}
                       onChange={(e) => runSearch(e.target.value)}
            />
        </Stack>
    )
}


const PublicationPage = ({pubData}) => {

    const [displayData, setDisplayData] = useState(pubData);

    return (
        <>
            <Head>
                <title>Aquila | Publication</title>
            </Head>
            <Container maxWidth={"xl"} sx={{
                my: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <Typography variant="h3" sx={{mx: 2}} fontFamily='Plus Jakarta Sans'>Publications</Typography>

                <SearchPubs data={pubData} updateDataFn={setDisplayData}/>
                {
                    displayData.length === 0 ? <OneItemCenter>
                        <Typography variant="h6" sx={{my: 6}}>No Data is Found</Typography>
                    </OneItemCenter> : <Grid container direction="column" justifyContent="flex-start" spacing={2} sx={{
                        mt: 4
                    }}>
                        {
                            displayData.map((record) => (
                                <MemoPubCard record={record} key={record.url}/>
                            ))
                        }
                    </Grid>
                }
            </Container>
        </>
    )
}

export async function getStaticProps() {
    const data = await fetcher(getRecordsURL);

    const pubData = Object.entries(groupBy(data, 'source_url')).map(([url, records]) => {
        return {
            title: records[0].source_name,
            url: url,
            journal: records[0].journal,
            year: records[0].year,
            species: uniq(records.map((r) => r.species)),
            technology: uniq(records.map((r) => r.technology)),
            tissue: uniq(records.map((r) => r.tissue)),
            disease: uniq(records.map((r) => r.disease)),
            data_uuids: records.map((r) => r.data_uuid),
        }
    }).sort((a, b) => b.year - a.year)

    return {
        props: {
            pubData: pubData
        },
        revalidate: 60
    }
}

export default PublicationPage;