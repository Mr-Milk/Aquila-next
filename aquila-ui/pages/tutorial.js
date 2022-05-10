import Container from "@mui/material/Container";

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import {useState} from "react";
import {getPlaiceholder} from "plaiceholder";
import Divider from "@mui/material/Divider";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Stack from "@mui/material/Stack";
import CheckIcon from '@mui/icons-material/Check';
import Head from "next/head";
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import IconButton from "@mui/material/IconButton";
import OneItemCenter from "../components/Layout/OneItemCenter";
import HelpOutline from "@mui/icons-material/HelpOutline";
import SubmitButton from "../components/InputComponents/SubmitButton";


const Title = ({sx, children}) => {
    return <Typography variant="h5" sx={{fontWeight: 600, ...sx}}>{children}</Typography>
}


function VerticalLinearStepper({title, steps}) {
    const [activeStep, setActiveStep] = useState(-1);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const stepsCount = steps.length - 1;

    return (
        <Box sx={{maxWidth: 800, mb: 2}}>
            <Stack direction="row" spacing={1} sx={{mb: 2}} alignItems="center">
                <Title>{title}</Title>
                {activeStep === -1 && (
                    <Button startIcon={<PlayCircleFilledIcon/>} onClick={handleReset} color="primary">
                        Start
                    </Button>
                )}
            </Stack>

            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                    <Step key={step.label}>
                        <StepLabel
                            optional={
                                index === stepsCount ? (
                                    <Typography variant="caption">Last step</Typography>
                                ) : null
                            }
                        >
                            {step.label}
                        </StepLabel>
                        <StepContent>
                            <Typography sx={{my: 2}}>{step.description}</Typography>
                            {
                                step.imageProps ?
                                    // eslint-disable-next-line jsx-a11y/alt-text
                                    <Image {...step.imageProps} placeholder="blur"/> : null
                            }
                            <Box sx={{mb: 2}}>
                                <div>
                                    <Button
                                        variant="contained"
                                        disableElevation
                                        onClick={handleNext}
                                        sx={{mt: 1, mr: 1}}
                                    >
                                        {index === stepsCount ? 'Finish' : 'Continue'}
                                    </Button>
                                    <Button
                                        disabled={index === 0}
                                        onClick={handleBack}
                                        sx={{mt: 1, mr: 1}}
                                    >
                                        Back
                                    </Button>
                                </div>
                            </Box>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
            {activeStep === steps.length && (
                <Paper square elevation={0} sx={{p: 1}}>
                    <Typography sx={{fontWeight: 500}}>🎉 Congratulation! You complete it!</Typography>
                    <Button size="small" onClick={handleReset} sx={{mt: 1, mr: 1}}>
                        View again
                    </Button>
                </Paper>
            )}
            <Divider/>
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


const TutorialPage = ({images}) => {
    const browseSteps = [
        {
            label: 'Find the entry to view all datasets',
            description: `The entry point for browse is at the header panel. It's available to all pages`,
            imageProps: images.browse.step1,
        },
        {
            label: 'Select a dataset that you interested',
            description: `After you enter the browse page, you can filter, search, or sort to find the dataset that you want.
        Click the view button to view that dataset.`,
            imageProps: images.browse.step2,
        },
        {
            label: 'Brief introduction to data card?',
            description: `For each dataset, You are presented with a data card, which contains lots of information related to
            this data.`,
            //imageProps: images.browse.step2,
        },
        {
            label: 'View the data',
            description: `Now click on the view button to view the dataset.`,
        },
        {
            label: 'What each section do?',
            description:
                <div>
                    <ul style={{lineHeight: 2}}>
                        <li>Data summary section: Information related to the dataset.</li>
                        <li>The region of interest (ROI) selection panel: You can switch between different ROI.</li>
                        <li>ROI Viewer: Visualize the spatial distribution of cells and expression.</li>
                    </ul>
                    Finally, we get to the amazing part of Aquila. The analysis panel.
                </div>,
        },
        {
            label: 'Perform spatial analysis',
            description: <Typography>{`Feel free to run all kinds of analysis including advanced spatial analysis. If you don't know what each parameter mean,
            it's ok to stick with defaults. Or check the`} <HelpOutline fontSize="small"/> {`for reference. Click on the`}
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

    const submitSteps = [
        {
            label: 'Find the entry point for analysis',
            description: `Check the analysis tab at the header panel. It\'s available to all pages.`,
            imageProps: images.analysis.step1,
        },
        {
            label: 'Prepare 3 files',
            description: <div>You need to prepare 3 files to run the analysis, they should all have headers,
            they should have same number of line, each line represent a cell or a record. Currently, we only
            support 2D data, support for 3D data is on its way!
                <ol style={{ lineHeight: 2 }}>
                    <li><b>ROI file</b>: Each line annotate the ROI that a cell belongs to.</li>
                    <li><b>Cell info file</b>: Must have at least 2 columns, coordination X, coordination Y or you can add an extra columns to specify
            cell type. This will unlock more analysis.</li>
                    <li><b>Expression file</b>: Each column is a gene, header is the gene name</li>
                </ol></div>,
            imageProps: images.analysis.step2,
        },
        {
            label: 'Specify a Data ID',
            description: `Although a random dataID is generated for you, it's highly recommended that you specify a meaningful name
            for the Data ID. In case you don't remember what that data is few days later.`,
            imageProps: images.analysis.step3,
        },
        {
            label: `Submit the files`,
            description: <div>Click <span style={{
                    color: 'white',
                    backgroundColor: '#FF9800',
                    margin: '5px',
                    padding: '8px',
                    fontSize: '0.7rem',
                    borderRadius: '5px'
                }}>
                    GO!
                </span> {`to start processing your file, it may take a long time
            since everything is running and saved on your local computer, please be patient. 
            Some people may submit a ROI file with patient information that are privacy, thus it's better to save
            all your data locally. Plus, you don't need to worry that it gets expired. But if you clear you browser 
                history or open in clock mode. It will be disappeared next time you open the site. Be careful!`}</div>,
            imageProps: images.analysis.step4,
        },
        {
            label: `Check your result`,
            description: `When the processing is finished, you should be about to see the newest one
            from the records, open it to run analysis freely on your own dataset. The usage is exactly the same as 
            any other datasets in Aquila.`,
            imageProps: images.analysis.step5,
        }
    ]

    // const dataSteps = [
    //     {
    //         label: 'Overview',
    //         description: `Now you enter the details page of a dataset, you should be able to see four parts`,
    //         //imageProps: images.browseStep1,
    //     },
    //     {
    //         label: 'Data Summary',
    //         description: `This part gives a summarize information of the dataset`,
    //         imageProps: images.data.step2,
    //     },
    //     {
    //         label: 'Select ROI',
    //         description: `A dataset usually contains multiple ROI, you can select different ROI
    //     using this table.`,
    //         imageProps: images.data.step3,
    //     },
    //     {
    //         label: 'ROI Viewer',
    //         description: `You can view spatial distribution of cells and the spatial expression of
    //         different markers using this panel`,
    //         imageProps: images.data.step4,
    //     },
    //     {
    //         label: 'Run spatial aquila_spatial',
    //         description: `Here, you are allowed to run various of advanced analysis. You check the
    //         help button if you don't know what that analysis is or what a parameters will do.
    //         To know more about each analysis, check the section below.`,
    //         imageProps: images.data.step5,
    //     }
    // ];

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

    return (
        <>
            <Head>
                <title>Aquila | Tutorial</title>
            </Head>
            <Container component="section" maxWidth="xl" sx={{my: 2, mx: {md: 4}}}>
                <VerticalLinearStepper title={"Browse Data"} steps={browseSteps}/>
                <VerticalLinearStepper title={"Analyze Your Data"} steps={submitSteps}/>
                {/*<VerticalLinearStepper title={"Using Analyze Panel"} steps={dataSteps}/>*/}
                <Title sx={{mb: 2}}>What does each analysis do?</Title>
                <StackAccordion items={analysisExplanations}/>
            </Container>
        </>
    )
}

export const getStaticProps = async () => {
    const {base64: blurBrowse1, img: imgBrowse1} = await getPlaiceholder("/tutorial_browse_step1.png")
    const {base64: blurBrowse2, img: imgBrowse2} = await getPlaiceholder("/tutorial_browse_step2.png")

    const {base64: blurAna1, img: imgAna1} = await getPlaiceholder("/tutorial_analysis_step1.png")
    const {base64: blurAna2, img: imgAna2} = await getPlaiceholder("/tutorial_analysis_step2.png")
    const {base64: blurAna3, img: imgAna3} = await getPlaiceholder("/tutorial_analysis_step3.png")
    const {base64: blurAna4, img: imgAna4} = await getPlaiceholder("/tutorial_analysis_step4.png")
    const {base64: blurAna5, img: imgAna5} = await getPlaiceholder("/tutorial_analysis_step5.png")

    const {base64: blurData2, img: imgData2} = await getPlaiceholder("/tutorial_data_step1.png")
    const {base64: blurData3, img: imgData3} = await getPlaiceholder("/tutorial_data_step2.png")
    const {base64: blurData4, img: imgData4} = await getPlaiceholder("/tutorial_data_step3.png")
    const {base64: blurData5, img: imgData5} = await getPlaiceholder("/tutorial_data_step4.png")

    return {
        props: {
            images: {
                browse: {
                    step1: {...imgBrowse1, blurDataURL: blurBrowse1},
                    step2: {...imgBrowse2, blurDataURL: blurBrowse2},
                },
                analysis: {
                    step1: {...imgAna1, blurDataURL: blurAna1},
                    step2: {...imgAna2, blurDataURL: blurAna2},
                    step3: {...imgAna3, width: imgAna3.width / 2, height: imgAna3.height / 2, blurDataURL: blurAna3},
                    step4: {...imgAna4, width: imgAna4.width / 2, height: imgAna4.height / 2, blurDataURL: blurAna4},
                    step5: {...imgAna5, width: imgAna5.width / 4, height: imgAna5.height / 4, blurDataURL: blurAna5},
                },
                data: {
                    step2: {
                        ...imgData2,
                        width: imgData2.width / 2,
                        height: imgData2.height / 2,
                        blurDataURL: blurData2
                    },
                    step3: {
                        ...imgData3,
                        width: imgData3.width / 6,
                        height: imgData3.height / 6,
                        blurDataURL: blurData3
                    },
                    step4: {
                        ...imgData4,
                        width: imgData4.width / 2,
                        height: imgData4.height / 2,
                        blurDataURL: blurData4
                    },
                    step5: {
                        ...imgData5,
                        width: imgData5.width / 2,
                        height: imgData5.height / 2,
                        blurDataURL: blurData5
                    },
                }
            }
        }
    }
}

export default TutorialPage;