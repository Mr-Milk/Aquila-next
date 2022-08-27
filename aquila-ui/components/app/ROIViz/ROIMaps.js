import {useState} from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import {TabPanel} from "components/Layout/TabPanel";
import {CellMapPanel, CoLocPanel, ExpPanel} from "components/app/ROIViz/ROIPanels";


const ROIMaps = ({roiID, roiMeta, recordData, cellData, bbox, is3D=false, getExpDataFn}) => {

    const [value, setValue] = useState(0);
    const handleChange = (e, v) => setValue(v);

    return (
        <Box sx={{width: '100%', mt: 4, border: 1, borderColor: 'divider'}}>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Cell Map"/>
                    <Tab label="Expression Map"/>
                    <Tab label="Markers Co-Localization"/>
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <CellMapPanel cellData={cellData} roiMeta={roiMeta} bbox={bbox} is3D={is3D}/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <ExpPanel
                    roiID={roiID}
                    cellData={cellData}
                    is3D={is3D}
                    markers={recordData.markers}
                    species={recordData.species}
                    getExpDataFn={getExpDataFn}
                />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <CoLocPanel
                    roiID={roiID}
                    cellData={cellData}
                    is3D={is3D}
                    markers={recordData.markers}
                    getExpDataFn={getExpDataFn}
                />
            </TabPanel>
        </Box>
    )
}

export default ROIMaps;