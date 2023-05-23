import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Image from "next/image"
import GitHub from "@mui/icons-material/GitHub";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import {getPlaiceholder} from "plaiceholder";
import Head from "next/head";


const Title = ({children}) => {
    return <Typography variant="h6"
                       sx={{mt: 4, mb: 2,}}>{children}</Typography>
}

const Content = ({children}) => {
    return <Typography variant="body1">{children}</Typography>
}

const TechItem = ({text, src}) => {
    return (
        <Stack alignItems="center">
            <Avatar variant="rounded" src={src}/>
            <Typography variant="subtitle1"
                        sx={{fontWeight: 500}}>{text}</Typography>
        </Stack>
    )
}

const methodColor = {
    "GET": "#1B813E",
    "POST": "#F7C242",
}

const API = ({method, entry, details}) => {

    let methodColor = "black"

    switch (method) {
        case undefined:
            method = "GET"
            methodColor = "#1B813E"
            break
        case "GET":
            methodColor = "#1B813E"
            break
        case "POST":
            methodColor = "#F7C242"
            break
        default:
            break
    }

    return (
        <>
            <Stack direction="row" spacing={2} sx={{my: 1}}>
                <Typography sx={{
                    color: methodColor,
                    fontWeight: 600
                }}>{method}</Typography>
                <Typography sx={{fontWeight: 600}}>{entry}</Typography>
                <Typography sx={{
                    fontStyle: "italic",
                    color: "#656765"
                }}>{details}</Typography>
            </Stack>
            <Divider sx={{maxWidth: "600px"}}/>
        </>
    )
}

const AboutPage = ({images}) => {
    return (
        <Container
            component="section"
            maxWidth="xl"
            sx={{mt: {sm: 1, xs: 2}, mb: 2}}
        >
            <Head>
                <title>Aquila | About</title>
            </Head>
            <Title>{"Author"}</Title>

            <Stack direction="row" alignItems="center" spacing={2}>
                <Link href="https://github.com/Mr-Milk">
                    <Avatar
                        src="https://avatars.githubusercontent.com/u/23433306?v=4"/>
                </Link>
                <Stack>
                    <Typography variant={"subtitle1"}>{"Milk"}</Typography>
                    <Typography
                        variant={"caption"}>yb97643@um.edu.mo</Typography>
                </Stack>

            </Stack>

            <Title>{"Publication"}</Title>
            <Content>{"Aquila: a spatial omics database and analysis platform"}
                <Link href="https://doi.org/10.1093/nar/gkac874">
                    <Typography fontStyle="italic">
                        {"Nucleic Acids Research"}
                    </Typography>
                </Link>
            </Content>

            <Title>Data Request</Title>
            <Content>{"If you found a dataset is not included in our database, you can either send an email to me or " +
                "open an issue on the Aquila GitHub repo. I'll be pleased to add them. Currently, we have no plan in " +
                "allowing user to upload their own research data as part of the database."}</Content>

            <Title>{"Using APIs to access Aquila"}</Title>
            <Content>{"Feel free to use following APIs to get data from Aquila server. Things place in {} are variables " +
                "that need to replace"}</Content>
            <Box component="div" sx={{my: 2}}>
                <API method={"ROOT"}
                     entry={<a
                         href="https://api.aquila.cheunglab.org">https://api.aquila.cheunglab.org</a>}/>
                <API entry={"/data_ids"}
                     details={"Get all data ID in the database."}/>
                <API entry={"/records"}
                     details={"Get records and their related information."}/>
                <API entry={"/record/{data_id}"}
                     details={"Get one record by specifying a data ID."}/>
                <API entry={"/rois/{data_id}"}
                     details={"Get all ROI information of a data."}/>
                <API entry={"/roi/{roi_id}"}
                     details={"Get one ROI information by specifying a ROI ID."}/>
                <API entry={"/cell_info/{roi_id} "}
                     details={"Get all cell information in a ROI."}/>
                <API entry={"/cell_exp/{roi_id}/{marker}"}
                     details={"Get cell expression of a marker in a ROI."}/>
                <API entry={"/static/{data_id}.zip"}
                     details={"Download the dataset by specifying as data ID."}/>
            </Box>


            <Title>Why we concern about data security?</Title>
            <Content>{"The source of spatial omics data may comes from " +
                "patient samples, and usually you need privacy information from patients to do the" +
                "spatial analysis. The security of remote server is not guaranteed. To ensure the best privacy, " +
                "none of the data will be sent to the server before running any of the spatial analysis." +
                "The data sent to the server only contains location, expression and cell type information. "}</Content>

            <Title>{"Advanced spatial omics analysis on large dataset"}</Title>
            <Content>{"Allow me to shamelessly promote "}<a
                href="https://github.com/Mr-Milk/SpatialTis" target="_blank"
                rel="noreferrer">SpatialTis</a>
                {": a spatial single-cell spatial analysis software written in Python and the underlying algorithms are implemented in Rust. " +
                    "It's easy to use and extremely fast. It allows you to perform analysis on hundreds or thousands of ROI simultaneously" +
                    "and visualize it. If you are interested, try it out!"}
            </Content>

            <Stack direction="column" justifyContent="center"
                   alignItems="center" sx={{my: 4}}>
                <a href="https://github.com/Mr-Milk/SpatialTis" target="_blank"
                   rel="noreferrer">
                    <Image {...images.spatialtisLogo} alt="spatialtis-logo"/>
                </a>
                <Typography variant={"caption"}
                            sx={{mt: 1}}>{"SpatialTis"}</Typography>
            </Stack>
            <Title>{"Technology stack for building Aquila"}</Title>
            <Content>{"If you are interested in the architecture of Aquila. " +
                "Here is a schema of the actual structure and technologies used to build Aquila." +
                "You can also check the Github repository to view the source code, it's open-sourced. "}
                <a href="https://github.com/Mr-Milk/Aquila-next"><GitHub/></a>
            </Content>
            <Stack direction="column" justifyContent="center"
                   alignItems="center" sx={{my: 4}}>
                <Image {...images.structure} alt="Aquila structure"/>
                <Typography variant={"caption"}
                            sx={{mt: 1}}>{"Architecture of Aquila"}</Typography>
            </Stack>

            <Stack direction="row" spacing={4} justifyContent="center"
                   alignItems="center">
                <TechItem
                    src="https://www.pinclipart.com/picdir/middle/537-5374089_react-js-logo-clipart.png"
                    text="React"
                />
                <TechItem
                    src="https://seeklogo.com/images/N/next-js-logo-8FCFF51DD2-seeklogo.com.png"
                    text="Next"
                />
                <TechItem
                    src="https://mui.com/static/logo.png"
                    text="MUI"
                />
            </Stack>

            <Stack direction="row" spacing={4} justifyContent="center"
                   alignItems="center" sx={{my: 2}}>
                <TechItem
                    src="https://avatars.githubusercontent.com/u/32776943?s=200&v=4"
                    text="Actix"
                />
                <TechItem
                    src="https://cdn.worldvectorlogo.com/logos/fastapi.svg"
                    text="FastAPI"
                />
                <TechItem
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/1200px-Postgresql_elephant.svg.png"
                    text="Postgres"
                />
            </Stack>

        </Container>
    )
}


export const getStaticProps = async () => {
    const {
        base64: base64Str,
        img: imgStr
    } = await getPlaiceholder("/Aquila-Structure.png")
    const {
        base64: base64ST,
        img: imgST
    } = await getPlaiceholder("/SpatialTis-Logo.svg")
    return {
        props: {
            images: {
                structure: {
                    ...imgStr,
                    blurDataURL: base64Str
                },
                spatialtisLogo: {
                    ...imgST,
                    blurDataURL: base64ST,
                }
            }
        }
    }
}

export default AboutPage