import ViewROICellMap from "@/components/app/View/ROICellMap";
import ViewROIExpMap from "@/components/app/View/ROIExpMap";
import useSWR from "swr";
import {fetcher, getOneRecordURL} from "@/data/get";
import {useEffect, useMemo, useState} from "react";
import VirtualizedAutoComplete from "@/components/VirtualizedAutoComplete";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import {a11yProps, TabPanel} from "@/components/TabPanel";
import ExpDist from "@/components/app/View/ExpDist";


const ROIMaps = ({dataID, roiID}) => {

    const {data} = useSWR(`${getOneRecordURL}/${dataID}`, fetcher);
    const markers = useMemo(() => (data !== undefined) ? data.markers : [""], [data]);

    const [marker, setMarker] = useState("");
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const mixcode = 'ROI-Viewer';

    useEffect(() => setMarker(markers[0]), [markers]);

    return (
        <Box sx={{width: '100%', mt: 4, border: 1, borderColor: 'divider'}}>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Cell Map" {...a11yProps(0, mixcode)} />
                    <Tab label="Expression Map" {...a11yProps(1, mixcode)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0} mixcode={mixcode}>
                <Grid component={"div"} container flexDirection="row" justifyContent="center">
                    <Grid component={"div"} item>
                        <ViewROICellMap roiID={roiID}/>
                    </Grid>
                </Grid>
            </TabPanel>
            <TabPanel value={value} index={1} mixcode={mixcode}>
                <Grid container flexDirection="row" justifyContent="center" alignItems="top">
                    <Grid item>
                        <Grid container flexDirection="column" justifyContent="center" alignItems="center">
                            <Grid item>
                                <VirtualizedAutoComplete
                                    options={markers}
                                    label={'Select marker'}
                                    value={marker}
                                    onChange={(e, marker) => setMarker(marker)}
                                    sx={{width: "200px", mb: 2}}
                                />
                            </Grid>
                            <Grid item>
                                <ExpDist roiID={roiID} marker={marker}/>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <ViewROIExpMap roiID={roiID} marker={marker}/>
                    </Grid>
                </Grid>
            </TabPanel>
        </Box>
    )
}

export default ROIMaps;