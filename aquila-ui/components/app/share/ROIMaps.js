import {useState} from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import {TabPanel} from "components/TabPanel";
import {CellMapPanel, ExpPanel} from "components/app/share/ROIPanels";


const ROIMaps = ({roiID, roiMeta, recordData, cellData, getExpDataFn}) => {

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
                    <CellMapPanel cellData={cellData} roiMeta={roiMeta}/>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <ExpPanel
                        roiID={roiID}
                        cellData={cellData}
                        markers={recordData.markers}
                        getExpDataFn={getExpDataFn}
                    />
                </TabPanel>
            </Box>
        </>
    )
}

export default ROIMaps;