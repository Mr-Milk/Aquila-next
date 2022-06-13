import {useCallback, useEffect, useRef, useState} from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {TabPanel} from "components/Layout/TabPanel";
import FindNeighborsTab from "components/app/share/FindNeighborsTab";
import CellComponentTab from "components/app/share/CellComponentTab";
import CellDensityTab from "components/app/share/CellDensityTab";
import CellDistributionTab from "components/app/share/CellDistributionTab";
import SpatialEntropyTab from "components/app/share/SpatialEntropyTab";
import Tooltip from "@mui/material/Tooltip";
import CellCellInteractionTab from "components/app/share/CellCellInteractionTab";
import SpatialAutocorrTab from "../share/SpatialAutocorrTab";
import SVGeneTab from "../share/SVGeneTab";
import CellExpressionTab from "../share/CellExpressionTab";
import CoExpTab from "../share/CoExpTab";
import RipleyTab from "../share/RipleyTab";
import SpatialCoExpTab from "../share/SpatialCoExpTab";
import CellCentralityTab from "../share/CellCentralityTab";
import SpatialCommunityTab from "../share/SpatialCommunityTab";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import DangerousSharpIcon from '@mui/icons-material/DangerousSharp';
import LockSharpIcon from '@mui/icons-material/LockSharp';

import create from 'zustand'


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


const TabTitle = ({label, disabled, disabledText, disabledType, ...other}) => {
    if (disabled) {
        return (
            <Tooltip title={disabledText}>
                <span style={{textAlign: 'center'}}>
                    <Tab disabled={disabled}
                         label={
                             <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                 {label}
                                 {(disabledType === "permanent") ?
                                     <DangerousSharpIcon sx={{ ml: 0.5 }} fontSize="inherit" color="disabled"/> :
                                         <LockSharpIcon sx={{ ml: 0.5 }} fontSize="inherit" color="info"/>}
                             </div>
                         }
                         {...other} />
                </span>
            </Tooltip>
        )
    } else {
        return <Tab label={label} {...other}/>
    }

}

const notLeaveTab = [0, 1, 2, 3, 4, 5, 6, 7];

const AnalysisTab = ({roiID, recordData, cellData, bbox, getCellExpBatch}) => {

    const hasCellType = recordData.has_cell_type;
    const size = cellData.cell_x.length;

    const neighborsData = useRef({});
    const [value, setValue] = useState(hasCellType ? 0 : 7);
    const [neighborsReady, setNeighborsStatus] = useState(false);

    const handleChange = (e, v) => setValue(v)
    const afterNeighbors = (neighbors) => {
        neighborsData.current = neighbors;
        //console.log(neighborsData.current)
        setNeighborsStatus(true)
    }
    const getNeighbors = useCallback(() => neighborsData.current, [])

    useEffect(() => {
        setNeighborsStatus(false)
    }, [roiID])

    useEffect(() => {
        if (notLeaveTab.includes(value)) {
            setValue(value)
        } else {
            setValue(hasCellType ? 0 : 7);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasCellType, roiID])

    return (
        <Box id="analysis-box-outer-box" sx={{width: '100%', mt: 4, border: 1, borderColor: 'divider'}}>
            <Box sx={{flexGrow: 1, display: 'flex'}}>
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    aria-label="Analysis tab"
                    sx={{borderRight: 1, borderColor: 'divider', minWidth: "240px", minHeight: '700px',}}
                >
                    <TabTitle id="tab-b-0" label="Cell components" disabled={!hasCellType} disabledType="permanent" disabledText={noCellTypeHelp}/>
                    <TabTitle id="tab-b-1" label="Cell density" disabled={!hasCellType} disabledType="permanent" disabledText={noCellTypeHelp}/>
                    <TabTitle id="tab-b-2" label="Cell expression" disabled={!hasCellType} disabledType="permanent" disabledText={noCellTypeHelp}/>
                    <Tab id="tab-b-3" label="Co-Expression"/>
                    <TabTitle id="tab-b-4" label="Cell distribution" disabled={!hasCellType} disabledType="permanent" disabledText={noCellTypeHelp}/>
                    <TabTitle id="tab-b-5" label="Ripley Statistics" disabled={!hasCellType} disabledType="permanent" disabledText={noCellTypeHelp}/>
                    <TabTitle id="tab-b-6" label="Spatial Entropy" disabled={!hasCellType} disabledType="permanent" disabledText={noCellTypeHelp}/>

                    <Tab id="tab-b-7" label={
                        <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                            {"Find Neighbors"}
                            {neighborsReady ?
                             <CheckCircleIcon sx={{ ml: 0.5 }} fontSize="inherit" color="success"/> :
                             <NewReleasesIcon sx={{ ml: 0.5 }} fontSize="inherit" color="error"/>
                    }
                        </div>
                    }
                    />
                    <TabTitle id="tab-b-8" label="Spatial Community" disabled={!neighborsReady} disabledText={noNeighborsHelp}/>
                    <TabTitle id="tab-b-9" label="Cell Centrality" disabled={(!hasCellType) || (!neighborsReady)}
                              disabledText={findNeighborsHelp(neighborsReady, hasCellType)} disabledType={(!hasCellType) ? "permanent" : "temporal"}/>

                    <TabTitle id="tab-b-10" label="Cell-Cell Interaction"
                              disabled={(!hasCellType) || (!neighborsReady)}
                              disabledText={findNeighborsHelp(neighborsReady, hasCellType)}
                              disabledType={(!hasCellType) ? "permanent" : "temporal"}
                    />
                    <TabTitle id="tab-b-11"
                              label="Spatial co-expression" disabled={!neighborsReady} disabledText={noNeighborsHelp}
                    />
                    <TabTitle id="tab-b-12" label="Spatial autocorrelation"
                              disabled={!neighborsReady}
                              disabledText={noNeighborsHelp}
                    />
                    <TabTitle id="tab-b-13" label="Spatial variable gene"
                              disabled={size > 5000}
                              disabledText={"Unavailable for ROI > 5000 cells, Current SV algorithms are not efficient to run on large ROI"}
                    />
                </Tabs>

                <TabPanel roiID={roiID} value={value} index={0}>
                    <CellComponentTab cellData={cellData}/>
                </TabPanel>
                <TabPanel roiID={roiID} value={value} index={1}>
                    <CellDensityTab cellData={cellData} bbox={bbox}/>
                </TabPanel>
                <TabPanel roiID={roiID} value={value} index={2}>
                    {/*Cell expression*/}
                    <CellExpressionTab roiID={roiID} recordData={recordData} cellData={cellData}
                                       getCellExpBatch={getCellExpBatch}/>
                </TabPanel>
                <TabPanel roiID={roiID} value={value} index={3}>
                    {/*Co expression*/}
                    <CoExpTab roiID={roiID} recordData={recordData} getCellExpBatch={getCellExpBatch}/>
                </TabPanel>
                <TabPanel roiID={roiID} value={value} index={4}>
                    <CellDistributionTab cellData={cellData} bbox={bbox}/>
                </TabPanel>
                <TabPanel roiID={roiID} value={value} index={5}>
                    {/*ripley*/}
                    <RipleyTab cellData={cellData}/>
                </TabPanel>
                <TabPanel roiID={roiID} value={value} index={6}>
                    <SpatialEntropyTab cellData={cellData} bbox={bbox}/>
                </TabPanel>
                <TabPanel roiID={roiID} value={value} index={7}>
                    <FindNeighborsTab roiID={roiID}
                                      cellData={cellData}
                                      updateNeighbors={afterNeighbors}
                                      getNeighbors={getNeighbors}
                                      bbox={bbox}
                    />
                </TabPanel>
                <TabPanel roiID={roiID} value={value} index={8}>
                    {/*spatial community*/}
                    <SpatialCommunityTab roiID={roiID} cellData={cellData} getNeighbors={getNeighbors} bbox={bbox}/>
                </TabPanel>
                <TabPanel roiID={roiID} value={value} index={9}>
                    {/*centrality*/}
                    <CellCentralityTab roiID={roiID} cellData={cellData} getNeighbors={getNeighbors}/>
                </TabPanel>
                <TabPanel roiID={roiID} value={value} index={10}>
                    <CellCellInteractionTab roiID={roiID} cellData={cellData} neighborsData={neighborsData.current}/>
                </TabPanel>
                <TabPanel roiID={roiID} value={value} index={11}>
                    <SpatialCoExpTab roiID={roiID} recordData={recordData}
                                     getCellExpBatch={getCellExpBatch} getNeighbors={getNeighbors}/>
                </TabPanel>
                <TabPanel roiID={roiID} value={value} index={12}>
                    <SpatialAutocorrTab roiID={roiID}
                                        recordData={recordData}
                                        cellData={cellData}
                                        getNeighbors={getNeighbors}
                                        getCellExpBatch={getCellExpBatch}
                    />
                </TabPanel>
                <TabPanel roiID={roiID} value={value} index={13}>
                    <SVGeneTab roiID={roiID}
                               recordData={recordData}
                               cellData={cellData}
                               getCellExpBatch={getCellExpBatch}
                    />
                </TabPanel>
            </Box>
        </Box>
    )
}

export default AnalysisTab;