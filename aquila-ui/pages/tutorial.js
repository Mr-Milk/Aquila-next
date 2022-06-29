import Container from "@mui/material/Container";

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import {getPlaiceholder} from "plaiceholder";
import Divider from "@mui/material/Divider";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Stack from "@mui/material/Stack";
import CheckIcon from '@mui/icons-material/Check';
import Head from "next/head";
import OneItemCenter from "../components/Layout/OneItemCenter";
import HelpOutline from "@mui/icons-material/HelpOutline";
import Link from "@mui/material/Link";


const Title = ({sx, children}) => {
    return <Typography variant="h5" sx={{fontWeight: 600, ...sx}}>{children}</Typography>
}


function VerticalLinearStepper({title, steps}) {
    return (
        <Box sx={{maxWidth: '900px', mb: 2}}>
            <Typography
                variant="h5"
                fontFamily="Plus Jakarta Sans"
                sx={{mb: 2}}
                id={title}
            >
                {title}
            </Typography>

            <Stepper orientation="vertical">
                {steps.map((step, index) => (
                    <Step key={step.label} active={true}>
                        <StepLabel>
                            <Typography variant="h6" fontFamily="Plus Jakarta Sans">{step.label}</Typography>
                        </StepLabel>
                        <StepContent>
                            <Box sx={{my: 2}}>{step.description}</Box>
                            {
                                step.imageProps ?
                                    // eslint-disable-next-line jsx-a11y/alt-text
                                    <Image {...step.imageProps} placeholder="blur"/> : null
                            }
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
            <Divider sx={{mt: 4, mb: 6}}/>
        </Box>
    );
}


const Requirement = ({text}) => {
    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <CheckIcon sx={{color: "#1B813E"}}/>
            <Typography sx={{fontWeight: 500}}>{text.toUpperCase()}</Typography>
        </Stack>
    )
}


function StackAccordion({items}) {
    return (
        <Box sx={{maxWidth: 770}}>
            {
                items.map((it, i) => {
                    return (
                        <Accordion disableGutters square elevation={0} key={i} sx={{
                            border: 1,
                            borderColor: "#bdbdbd",
                            '&:not(:last-child)': {
                                borderBottom: 0,
                            },
                            '&:before': {
                                display: 'none',
                            },
                        }}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon/>}
                            >
                                <Typography sx={{width: '33%', flexShrink: 0, fontWeight: 500}}>
                                    {it.title}
                                </Typography>
                                <Typography sx={{color: 'text.secondary'}}>{it.summary}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Stack direction="row" alignItems="center" spacing={2} sx={{mb: 1}}>
                                    {/*{it.singlecell ? <Requirement text={"Single cell"}/> : null}*/}
                                    {it.cellType ? <Requirement text={"Cell type"}/> : null}
                                    {it.neighbors ? <Requirement text={"Neighbors"}/> : null}
                                </Stack>
                                {it.rich ? <div dangerouslySetInnerHTML={{__html: it.details}}/> :
                                    <Typography>{it.details}</Typography>}
                            </AccordionDetails>
                        </Accordion>
                    )
                })
            }
        </Box>
    )
}

const TOCItem = ({refTitle}) => {
    return <Link underline="none" color="inherit" href={`#${refTitle}`}
                 sx={{
                     "&:hover": {
                         textDecoration: 'underline'
                     }
                 }}>#{refTitle}</Link>
}


const TutorialPage = ({images}) => {
    const browseSteps = [
        {
            label: 'Find the entry to view all datasets',
            description: `There are two ways to view datasets in Aquila. 
            You can view all the dataset at once. Or by publications.`,
            imageProps: images.browse.step1,
        },
        {
            label: 'Find your interesting datasets',
            description: <div>{`After you enter the dataset page, 
            you can search, filter, or sort to find the dataset that you want.`}
                <ul>
                    <li><b>Search:</b> You can search by any keywords or search by marker or gene name.</li>
                    <li><b>Filter:</b> Use the filter panel below to select the conditions.</li>
                    <li><b>Sort:</b> You can sort by number of cells/markers/ROI, year or publications.</li>
                </ul>
            </div>,
            imageProps: images.browse.step2,
        },
        {
            label: `What's in the data card?`,
            description: `For each dataset, You are presented with a data card containing lots of information related to
            this data.`,
            imageProps: images.browse.step3,
        },
        {
            label: 'Download the datasets',
            description: 'You can click on the download button on the data card to download one dataset. ' +
                'To download multiple datasets, add the dataset to the download list. ' +
                'Once you select enough datasets, click the download list button, and confirm to proceed.'
        },
        {
            label: 'View the data',
            description: `Click on the view button to view the dataset.`,
        },

        {
            label: 'Perform spatial analysis',
            description: <Typography>{`Feel free to run all kinds of analysis including advanced spatial analysis. If you don't know what each parameter mean,
            it's ok to stick with defaults. Or check the`} <HelpOutline
                fontSize="small"/> {`for reference. Click on the`}
                <span style={{
                    color: 'white',
                    backgroundColor: '#FF9800',
                    margin: '5px',
                    padding: '8px',
                    fontSize: '0.7rem',
                    borderRadius: '5px'
                }}>
                    RUN
                </span>
                {`to run the analysis, the visualization will
                be automatically shown or updated.`}</Typography>,
        },
        {
            label: 'Good to go!',
            description: `Now that you got some idea on how to use Aquila, you may want to run those analysis on your own data. Gladly,
            this is made available in analysis section. Check next tutorial part for details. Keep going!`
        }
    ];

    const viewSteps = [
        {
            label: 'What each section do?',
            description:
                <div>
                    <ul>
                        <li>Data summary section: Information related to the dataset.</li>
                        <li>Select ROI: You can switch between different ROIs.</li>
                        <li>ROI Preview: Visualize the spatial distribution of cells and expression.</li>
                    </ul>
                </div>,
            imageProps: images.data.step1,
        },
        {
            label: 'Select an ROI',
            description: 'Click the view to select an ROI. ' +
                'This ROI is then added to the ROI preview panel and the following ROI visualization panel. ' +
                'Delete the unwanted ROI if you add many ROIs in the ROI preview panel.',
        },
        {
            label: 'Cell Map',
            description: 'When you select an ROI, here is where you view its details. ' +
                'You can click the legend item to mute a particular cell type. ' +
                'Use the two sliders to adjust the point size and canvas size.',
            imageProps: images.data.step2
        },
        {
            label: 'Expression Map',
            description: 'You can select multiple markers and view their expressions at the same time. ' +
                'An expression distribution profile is presented for you. ' +
                'This work similarly with ROI panels.',
            imageProps: images.data.step3
        },
        {
            label: 'Markers Co-localization',
            description: 'As a mocking visualization of experiments like IF or FISH, ' +
                'you can visualize more than one marker in one ROI by mixing different colors.',
            imageProps: images.data.step4
        }
    ]

    const analysisSteps = [
        {
        label: 'Analysis panel',
        description: 'You can select different analyses on the left side panel. ' +
            'Notice that some analysis is locked at first ' +
            'because they require the information from step `Find Neighbors`. ' +
            'After embedding the neighbor network, the locks are gone. ' +
            'If you found other analyses unavailable, ' +
            'some analyses rely on cell type information, ' +
            'which is missed in the dataset.',
        imageProps: images.spatial.step1},
        {
            label: 'Prompts in analysis',
            description: <Typography>{'You likely have no idea what an analysis does. ' +
                'Hence, we provide you with a brief introduction to each analysis. ' +
                'Click on the expand arrow to view the details of each analysis. ' +
                'You can hover on the'}<span><HelpOutline fontSize="small" sx={{ mx: 1 }}/></span>
            {'to get a tip if you don\'t know what a parameter does. ' +
                        'Don\'t want to mess with your brain? ' +
                'Stick with default values is always great.'}</Typography>
        },
        {
            label: 'Run the analysis',
            description: <Typography>{`Click on the`}
                <span style={{
                    color: 'white',
                    backgroundColor: '#FF9800',
                    margin: '5px',
                    padding: '8px',
                    fontSize: '0.7rem',
                    borderRadius: '5px'
                }}>
                    RUN
                </span>
                {`to run the analysis, the visualization will
                be automatically shown or updated.`}</Typography>,
        }
    ];

    const submitSteps = [
        {
            label: 'Prepare 3 files',
            description: <div>You need to prepare 3 files to run the analysis.
                They should all have headers and the same number of lines representing cells.
                Currently, we only support 2D data.
                Support for 3D data is on its way!
                <ol style={{lineHeight: 2}}>
                    <li><b>ROI file</b>: Each line annotates the ROI that the cell belongs to.</li>
                    <li><b>Cell info file</b>: Must have at least 2 columns,
                        coordination X and coordination Y,
                        or you can add an extra column to specify cell type.
                    </li>
                    <li><b>Expression file</b>: Each column is a gene, and the header is the gene name.</li>
                </ol></div>,
            imageProps: images.analysis.step1,
        },
        {
            label: 'Specify a Data ID',
            description: `Although a random Data ID is generated for you, 
            it's highly recommended that you put a meaningful name instead of a meaningless Data ID. 
            In case you don't remember the content of that data a few days later. 
            Click the start to run the analysis.`,
            imageProps: images.analysis.step2,
        },
        {
            label: `Run the analysis`,
            description: <div>Click <span style={{
                color: 'white',
                backgroundColor: 'green',
                margin: '5px',
                padding: '8px',
                fontSize: '0.7rem',
                borderRadius: '5px'
            }}>
                    START
                </span> {`to start processing your file, it may take a while. 
                A status bar would show you which step is currently on. 
                Every data is saved on your local computer for your data privacy! 
                The analysis record will never get expired if you don't delete it. 
                But if you clear your browser cache. 
                It will be disappeared. Be careful!`}</div>,
            imageProps: images.analysis.step3,
        },
        {
            label: `Check your result`,
            description: `When the processing is finished, 
            you should be about to see the newest one from the records 
            and open it to run analysis freely on your dataset. 
            The usage is the same as any other datasets in Aquila.`,
            imageProps: images.analysis.step4,
        }
    ]


    const analysisExplanations = [
        {
            title: 'Cell components',
            summary: 'Proportion of each cell type',
            details: 'Simple statistics on the proportion of different cell types',
            cellType: true,
            neighbors: false,
        },
        {
            title: 'Cell density',
            summary: 'Density of different of different cells',
            details: 'Simple statistics on the density of different cell types',
            cellType: true,
            neighbors: false,
        },
        {
            title: 'Cell expression',
            summary: 'Marker expression in different cell types',
            details: '',
            cellType: true,
            neighbors: false,
        },
        {
            title: 'Co-expression',
            summary: 'Marker co-expression',
            details: 'The expression correlation between two or more markers',
            cellType: false,
            neighbors: false,
        },
        {
            title: 'Spatial Co-expression',
            summary: 'Marker co-expression with spatial information',
            details: 'The correlation between two or more markers expression at cells neighbors',
            cellType: false,
            neighbors: true,
        },
        {
            title: 'Ripley Statistics',
            summary: 'The distribution characteristics at different distance range',
            details: 'Few functions can be used profile the distribution of different cells at different distance range',
            cellType: true,
            neighbors: false,
        },
        {
            title: 'Cell distribution',
            summary: 'Distribution pattern for each cell type',
            rich: true,
            details: '<Typography>There are three patterns</Typography>' +
                '<p>1) Random</p>' +
                '<p>2) Cluster: Cells are aggregated together</p>' +
                '<p>3) Evenly distributed: This is very common to see</p>',
            cellType: true,
            neighbors: false,
        },
        {
            title: 'Find neighbors',
            summary: 'Get to know the neighbors for each cells',
            details: `You can know whether two cells are neighbors to each other, 
            in the visualization, two cell will be linked if they are neighbors`,
            cellType: false,
            neighbors: false,
        },
        {
            title: 'Spatial community',
            summary: 'Find the cell community based on neighbor graph',
            details: `Using graph community detection algorithms to cut the graph into different communities.`,
            cellType: false,
            neighbors: true,
        },
        {
            title: 'Cell centrality',
            summary: 'How how a cell is connected to other cells',
            details: `Calculate different centrality metrics based on neighbor graph`,
            cellType: true,
            neighbors: true,
        },
        {
            title: 'Cell-Cell interaction',
            summary: 'Check if two type of cell tend to stick together',
            rich: true,
            details: `This is to determine the spatial interaction between two cell type, 
            either association or avoidance. Association means they are likely to appear at
            each others neighborhood mostly. Notice that we use a permutation method here, the
            results are <b>NOT deterministic</b>.`,
            cellType: true,
            neighbors: true,
        },
        {
            title: 'Spatial entropy',
            summary: 'Evaluation of the tissue heterogeneity with spatial factor',
            details: 'Useful to evaluate the heterogeneity within a tissue',
            singlecell: true,
            cellType: true,
            neighbors: false,
        },
        {
            title: 'Spatial auto-correlation',
            summary: 'Correlation between expression and nearby spatial location',
            details: `Value close to -1 and is significant indicate negative spatial 
            auto-correlation and vice versa.`,
            singlecell: false,
            cellType: false,
            neighbors: true,
        },
        {
            title: 'Spatial variable gene',
            summary: 'Whether the gene expression is dependent on spatial location',
            details: `If a gene is spatial variable, it suggest that spatial factor has certain
            influence on it's expression`,
            singlecell: false,
            cellType: false,
            neighbors: true,
        },
    ]

    const contents = [
        {title: 'Browse Data', steps: browseSteps},
        {title: 'Data Viewer', steps: viewSteps},
        {title: 'Spatial Analysis', steps: analysisSteps},
        {title: 'Analyze Your Spatial Omics Data', steps: submitSteps}
    ]

    return (

        <Container component="section" maxWidth="xl" sx={{mt: 2, mb: 2}}>
            <Head>
                <title>Aquila | Tutorial</title>
            </Head>
            <OneItemCenter>
                <Stack spacing={2} sx={{mt: 2, mb: 4}}>
                    <Typography
                        variant="h4"
                        fontFamily="Plus Jakarta Sans"
                    >
                        Tutorial
                    </Typography>
                    <ul style={{lineHeight: '2rem'}}>
                        {
                            contents.map((i) => (
                                <li key={i.title}><TOCItem refTitle={i.title}/></li>
                            ))
                        }
                    </ul>
                </Stack>
                {
                    contents.map((i) => (
                        <VerticalLinearStepper title={i.title} steps={i.steps} key={i.title}/>
                    ))
                }


                {/*<VerticalLinearStepper title={"Browse Data"} steps={browseSteps} id={id}/>*/}
                {/*<VerticalLinearStepper title={"Data Viewer"} steps={viewSteps} id={id}/>*/}
                {/*<VerticalLinearStepper title={"Spatial Analysis"} steps={analysisSteps} id={id}/>*/}
                {/*<VerticalLinearStepper title={"Analyze Your Spatial Omics Data"} steps={submitSteps} id={id}/>*/}
                {/*<VerticalLinearStepper title={"Using Analyze Panel"} steps={dataSteps}/>*/}
                <Title sx={{mb: 2}}>What does each analysis do?</Title>
                <StackAccordion items={analysisExplanations}/>
            </OneItemCenter>

        </Container>
    )
}

const createBlur = async (images) => {
    const container = {};
    await Promise.all(images.map(async (im, i) => {
        const {base64, img} = await getPlaiceholder(im)
        container[`step${i + 1}`] = {...img, blurDataURL: base64, width: img.width * 0.5, height: img.height * 0.5}
    }))
    return container;
}

export const getStaticProps = async () => {

    const browseImages = await createBlur([
        "/tutorial_browse_step1.png",
        "/tutorial_browse_step2.png",
        "/tutorial_browse_step3.png",
    ])

    const dataImages = await createBlur([
        "/tutorial_data_step1.png",
        "/tutorial_data_step2.png",
        "/tutorial_data_step3.png",
        "/tutorial_data_step4.png",
    ])

    const spatialImages = await createBlur([
        "/tutorial_spatial_step1.png",
    ])

    const analysisImages = await createBlur([
        "/tutorial_analysis_step1.png",
        "/tutorial_analysis_step2.png",
        "/tutorial_analysis_step3.png",
        "/tutorial_analysis_step4.png",
    ])

    return {
        props: {
            images: {
                browse: browseImages,
                data: dataImages,
                spatial: spatialImages,
                analysis: analysisImages,
            }
        }
    }
}

export default TutorialPage;