import {useRef, useState} from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import {TabPanel} from "components/TabPanel";
import useSWR from "swr";
import {fetcher, getOneRecordURL} from "data/get";
import FindNeighborsTab from "components/app/View/FindNeighborsTab";
import CellComponentTab from "components/app/View/CellComponentTab";
import CellDensityTab from "components/app/View/CellDensityTab";
import CellDistributionTab from "components/app/View/CellDistributionTab";
import SpatialEntropyTab from "components/app/View/SpatialEntropyTab";
import Tooltip from "@mui/material/Tooltip";
import CellCellInteractionTab from "components/app/View/CellCellInteractionTab";


const noCellTypeHelp = "Cell type annotation unavailable in this dataset"
const noNeighborsHelp = "Run Find neighbors before proceeding";

const findNeighborsHelp = (neighborsReady, hasCellType) => {
    if (!neighborsReady && !hasCellType) {
        return `1. ${noNeighborsHelp} 2. ${noCellTypeHelp}`
    } else if (!neighborsReady) {
        return noNeighborsHelp
    } else if (!hasCellType) {
        return noCellTypeHelp
    } else {
        return ""
    }
}


const TabTitle = ({label, disabled, disabledText, ...other}) => {
    if (disabled) {
        return (
            <Tooltip title={disabledText}>
                <span style={{textAlign: 'center'}}>
                    <Tab label={label} disabled={disabled} {...other} />
                </span>
            </Tooltip>
        )
    } else {
        return <Tab label={label} {...other}/>
    }

}


const AnalysisTab = ({dataID, roiID}) => {

    const {data, error} = useSWR(`${getOneRecordURL}/${dataID}`, fetcher);
    const hasCellType = data.has_cell_type;

    const neighborsData = useRef({});
    const [value, setValue] = useState(0);
    const [neighborsReady, setNeighborsStatus] = useState(false);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const afterNeighbors = (neighbors) => {
        neighborsData.current = neighbors;
        setNeighborsStatus(true)
    };
    const getNeighborsData = () => {
        return neighborsData.current
    };

    return (
        <Box id="analysis-box-outer-box" sx={{width: '100%', mt: 4, border: 1, borderColor: 'divider'}}>
            <Box sx={{flexGrow: 1, display: 'flex'}}>
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    aria-label="Analysis tab"
                    sx={{borderRight: 1, borderColor: 'divider'}}
                >
                    <TabTitle id="tab-b-0" label="Cell components" disabled={!hasCellType}
                              disabledText={noCellTypeHelp}/>
                    <TabTitle id="tab-b-1" label="Cell density" disabled={!hasCellType} disabledText={noCellTypeHelp}/>
                    <TabTitle id="tab-b-2" label="Cell distribution" disabled={!hasCellType}
                              disabledText={noCellTypeHelp}/>
                    <TabTitle id="tab-b-3" label="Spatial Entropy" disabled={!hasCellType}
                              disabledText={noCellTypeHelp}/>
                    <Tab id="tab-b-4" label="Find Neighbors"/>
                    <TabTitle id="tab-b-5" label="Cell-Cell Interaction"
                              disabled={false}//disabled={(!hasCellType) || (!neighborsReady)}
                              disabledText={findNeighborsHelp(neighborsReady, hasCellType)}/>
                    <TabTitle id="tab-b-6" label="Spatial co-expression" disabled={!neighborsReady}
                              disabledText={noNeighborsHelp}/>
                    <TabTitle id="tab-b-7" label="Spatial autocorrelation" disabled={!neighborsReady}
                              disabledText={noNeighborsHelp}/>
                    <TabTitle id="tab-b-8" label="Spatial variable gene" disabled={!neighborsReady}
                              disabledText={noNeighborsHelp}/>
                </Tabs>
                <TabPanel roiID={roiID} value={value} index={0}>
                    <CellComponentTab roiID={roiID}/>
                </TabPanel>
                <TabPanel roiID={roiID} value={value} index={1}>
                    <CellDensityTab roiID={roiID}/>
                </TabPanel>
                <TabPanel roiID={roiID} value={value} index={2}>
                    <CellDistributionTab roiID={roiID}/>
                </TabPanel>
                <TabPanel roiID={roiID} value={value} index={3}>
                    <SpatialEntropyTab roiID={roiID}/>
                </TabPanel>
                <TabPanel roiID={roiID} value={value} index={4}>
                    <FindNeighborsTab roiID={roiID} updateNeighbors={afterNeighbors}
                                      neighborsData={neighborsData.current}/>
                </TabPanel>
                <TabPanel roiID={roiID} value={value} index={5}>
                    <Typography>Cell-Cell Interaction</Typography>
                    <CellCellInteractionTab roiID={roiID} neighborsData={neighborsData.current}/>
                </TabPanel>
                <TabPanel roiID={roiID} value={value} index={6}>
                    <Typography>Spatial co-expression page</Typography>
                </TabPanel>
                <TabPanel roiID={roiID} value={value} index={7}>
                    <Typography>Spatial autocorrelation page</Typography>
                </TabPanel>
                <TabPanel roiID={roiID} value={value} index={8}>
                    <Typography>Spatial variable gene page</Typography>
                </TabPanel>
            </Box>
        </Box>
    )
}

export default AnalysisTab;