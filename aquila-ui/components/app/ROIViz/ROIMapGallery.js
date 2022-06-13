import Box from "@mui/material/Box";
import {useCellData2D} from "../../../data/get";
import {CellMap2DThumbNail} from "../../Viz/CellMap2D";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {memo, useState} from "react";
import IconButton from "@mui/material/IconButton";
import Clear from "@mui/icons-material/Clear";


const ROIMapThumbNail = ({roiID, roiMeta, setCurrentROI, getCellData}) => {

    const {data: cellData} = getCellData(roiID);

    return <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        onClick={() => {
            setCurrentROI(roiID, roiMeta)
        }}
        spacing={1}
        sx={{
            p: 1,
            cursor: 'pointer',
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: 'rgba(0,0,0,0)',
            '&:hover': {
                borderColor: 'primary.main',
                background: "rgba(253,151,0,0.1)",
                transition: 'background 0.5s, border-color 0.5s',
            }
        }}>
        <CellMap2DThumbNail
            cx={cellData.cell_x}
            cy={cellData.cell_y}
            ct={cellData.cell_type}
        />
        <Stack sx={{
            maxWidth: '200px',
            inlineSize: '150px',
            overflowWrap: 'break-word',
        }}>
            {
                roiMeta.map((r, i) => {
                    return <Stack key={i} direction="row" spacing={1}>
                        <Typography variant={"subtitle2"}
                                    fontWeight={400}>{r.header}</Typography>
                        <Typography variant={"subtitle2"}
                                    sx={{
                                        color: "secondary.main",
                                        wordBreak: 'break-all'
                                    }}>{r.value}</Typography>
                    </Stack>
                })
            }
        </Stack>
    </Stack>
}

const MemoROIMapThumbNail = memo(ROIMapThumbNail)


const ROIPreviewItem = ({roiID, roiMeta, setCurrentROI, deleteROI, getCellData}) => {

    const [showDelete, setShowDelete] = useState(false);

    return <Grid item>
        <Stack
            direction="row"
            alignItems="flex-start"
            onMouseOver={() => setShowDelete(true)}
            onMouseOut={() => setShowDelete(false)}>
            <MemoROIMapThumbNail roiID={roiID} roiMeta={roiMeta}
                                 setCurrentROI={setCurrentROI}
                                 getCellData={getCellData}
            />
            {
                showDelete ? <IconButton size="small" color="error" onClick={() => deleteROI(roiID)}>
                    <Clear/>
                </IconButton> : null
            }
        </Stack>
    </Grid>
}

const MemoROIPreviewItem = memo(ROIPreviewItem)


const ROIMapGallery = ({roiList, roiMetaList, setCurrentROI, deleteROI, getCellData}) => {
    return (
        <Box sx={{width: '100%', mt: 4, border: 1, borderColor: 'divider', p: 2}}>
            <Stack alignItems="flex-start" direction="column">
                <Typography variant={"h6"} sx={{px: 1}}>ROI Preview</Typography>
                <Grid container justifyContent="flex-start" spacing={2} alignItems="center">
                    {
                        roiList.map((roiID, i) => {
                            return <MemoROIPreviewItem roiID={roiID} roiMeta={roiMetaList[i]}
                                                   setCurrentROI={setCurrentROI} deleteROI={deleteROI}
                                                       getCellData={getCellData}
                                                   key={roiID}
                            />
                        })
                    }
                </Grid>
            </Stack>
        </Box>
    )
}

export default ROIMapGallery;