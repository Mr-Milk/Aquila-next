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
import SpatialAutocorrTab from "./SpatialAutocorrTab";
import SVGeneTab from "./SVGeneTab";
import CellExpressionTab from "./CellExpressionTab";
import CoExpTab from "./CoExpTab";
import RipleyTab from "./RipleyTab";
import SpatialCoExpTab from "./SpatialCoExpTab";
import CellCentralityTab from "./CellCentralityTab";
import SpatialCommunityTab from "./SpatialCommunityTab";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import DangerousSharpIcon from '@mui/icons-material/DangerousSharp';
import LockSharpIcon from '@mui/icons-material/LockSharp';


const noCellTypeHelp = "Cell type annotation unavailable in this dataset"
const noNeighborsHelp = "Run Find neighbors before proceeding";
const only2DHelp = "Cannot run on to 3D dataset."


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


const TabTitle = ({label, requireCT=false, requireNeighbors=false, run3d=true, status,
                      disabled, disabledText, disabledType = "temporal", ...other}) => {

    if (disabledText === undefined) {
        disabledText = ""
    }

    if (disabled === undefined) {

        if (requireNeighbors && !status.neighborsReady) {
            disabled = true
            disabledType = "temporal";
            disabledText = `${noNeighborsHelp}\n`
        }

         if (requireCT && !status.hasCellType) {
            disabled = true;
            disabledType = "permanent";
            disabledText = `${noCellTypeHelp}\n`
        }

        if (!run3d && status.is3D) {
            disabled = true
            disabledType = "permanent";
            disabledText = `${only2DHelp}\n`
        }
    }

    if (disabled) {
        return (
            <Tooltip title={disabledText}>
                <span style={{textAlign: 'center'}}>
                    <Tab disabled={disabled}
                         label={
                             <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                 {label}
                                 {(disabledType === "permanent") ?
                                     <DangerousSharpIcon sx={{ml: 0.5}} fontSize="inherit" color="disabled"/> :
                                     <LockSharpIcon sx={{ml: 0.5}} fontSize="inherit" color="info"/>}
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

const AnalysisTab = ({roiID, recordData, cellData, bbox, getCellExpBatch, is3D=false}) => {

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
    const status = {
        hasCellType: hasCellType,
        neighborsReady: neighborsReady,
        is3D: is3D
    }

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
                    <TabTitle id="tab-b-0" label="Cell components" requireCT={true} status={status}/>
                    <TabTitle id="tab-b-1" label="Cell density" requireCT={true} status={status}/>
                    <TabTitle id="tab-b-2" label="Cell expression" requireCT={true} status={status}/>
                    <Tab id="tab-b-3" label="Co-Expression"/>
                    {/*no 3d*/}
                    <TabTitle id="tab-b-4" label="Cell distribution" requireCT={true} run3d={false} status={status}/>
                    {/*no 3d*/}
                    <TabTitle id="tab-b-5" label="Ripley Statistics" requireCT={true} run3d={false} status={status}/>
                    {/*no 3d*/}
                    <TabTitle id="tab-b-6" label="Spatial Entropy" requireCT={true} run3d={false} status={status}/>

                    <Tab id="tab-b-7" label={
                        <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                            {"Find Neighbors"}
                            {neighborsReady ?
                                <CheckCircleIcon sx={{ml: 0.5}} fontSize="inherit" color="success"/> :
                                <NewReleasesIcon sx={{ml: 0.5}} fontSize="inherit" color="error"/>
                            }
                        </div>
                    }
                    />
                    <TabTitle id="tab-b-8" label="Spatial Community" requireNeighbors={true} status={status}/>
                    <TabTitle id="tab-b-9" label="Cell Centrality" requireNeighbors={true} requireCT={true} status={status}/>
                    <TabTitle id="tab-b-10" label="Cell-Cell Interaction" requireNeighbors={true} requireCT={true} status={status}/>
                    <TabTitle id="tab-b-11" label="Spatial co-expression" requireNeighbors={true} status={status}/>
                    <TabTitle id="tab-b-12" label="Spatial autocorrelation" requireNeighbors={true} status={status}/>
                    <TabTitle id="tab-b-13" label="Spatial variable gene"
                              disabled={is3D || size > 5000}
                              disabledType={is3D ? "permanent" : "temporal"}
                              disabledText={is3D ? "Cannot run on 3D dataset" :
                                  "Unavailable for ROI > 5000 cells, " +
                                  "Current SV algorithms are not efficient to run on large ROI"}
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
                                      is3D={is3D}
                    />
                </TabPanel>
                <TabPanel roiID={roiID} value={value} index={8}>
                    {/*spatial community*/}
                    <SpatialCommunityTab roiID={roiID} cellData={cellData} getNeighbors={getNeighbors} bbox={bbox} is3D={is3D}/>
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