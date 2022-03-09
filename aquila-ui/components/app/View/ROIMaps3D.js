import {useExpData} from "data/get";
import {useState} from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import {TabPanel} from "components/TabPanel";
import {CellMapPanel3D, ExpPanel3D} from "components/app/share/ROIPanels3D";
import VirtualizedAutoComplete from "../../VirtualizedAutoComplete";
import ClientOnly from "../../ClientOnly";


const ROIMaps3D = ({ roiID, roiMeta, recordData, cellData }) => {

    const [value, setValue] = useState(0);
    const handleChange = (e, v) => setValue(v);

    return (
        <>
        <Box sx={{width: '100%', mt: 4, border: 1, borderColor: 'divider'}}>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Cell Map"/>
                    <Tab label="Expression Map"/>
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <CellMapPanel3D cellData={cellData} roiMeta={roiMeta}/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <ExpPanel3D
                    roiID={roiID}
                    cellData={cellData}
                    markers={recordData.markers}
                />
            </TabPanel>
        </Box>
        </>
    )
}

export default ROIMaps3D;