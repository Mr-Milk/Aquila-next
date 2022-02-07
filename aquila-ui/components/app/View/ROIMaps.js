import {useExpData} from "data/get";
import {useState} from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import {TabPanel} from "components/TabPanel";
import {CellMapPanel, ExpPanel} from "components/app/share/ROIPanels";
import VirtualizedAutoComplete from "../../VirtualizedAutoComplete";
import ClientOnly from "../../ClientOnly";


const ROIMaps = ({ marker, roiID, recordData, cellData, updateMarker }) => {

    const [value, setValue] = useState(0);
    const handleChange = (e, v) => setValue(v);

    const {data: expData} = useExpData(roiID, marker);

    return (
        <>
        <Box sx={{width: '100%', mt: 4, border: 1, borderColor: 'divider'}}>
            <ClientOnly>
                <VirtualizedAutoComplete
                options={recordData.markers}
                label={'Select marker'}
                value={marker}
                onChange={updateMarker}
                sx={{width: "200px", mb: 2, mt: 2, ml: 4}}
            />
            </ClientOnly>

            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Cell Map"/>
                    <Tab label="Expression Map"/>
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <CellMapPanel cellData={cellData}/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <ExpPanel
                    cellData={cellData}
                    expData={expData}
                    marker={marker}
                />
            </TabPanel>
        </Box>
        </>
    )
}

export default ROIMaps;