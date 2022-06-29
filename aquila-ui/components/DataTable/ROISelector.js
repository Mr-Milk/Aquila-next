import {DataGrid, GridToolbar} from '@mui/x-data-grid';
import {memo, useCallback, useEffect, useMemo, useRef, useState} from "react";
import Button from "@mui/material/Button";
import {parseROIDisplay} from "../humanize";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

function isOverflown(element) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

const GridCellExpand = memo(function GridCellExpand(props) {
  const { width, value } = props;
  const wrapper = useRef(null);
  const cellDiv = useRef(null);
  const cellValue = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showFullCell, setShowFullCell] = useState(false);
  const [showPopper, setShowPopper] = useState(false);

  const handleMouseEnter = () => {
    const isCurrentlyOverflown = isOverflown(cellValue.current);
    setShowPopper(isCurrentlyOverflown);
    setAnchorEl(cellDiv.current);
    setShowFullCell(true);
  };

  const handleMouseLeave = () => {
    setShowFullCell(false);
  };

  useEffect(() => {
    if (!showFullCell) {
      return undefined;
    }

    function handleKeyDown(nativeEvent) {
      // IE11, Edge (prior to using Bink?) use 'Esc'
      if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
        setShowFullCell(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setShowFullCell, showFullCell]);

  return (
    <Box
      ref={wrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        alignItems: 'center',
        lineHeight: '24px',
        width: 1,
        height: 1,
        position: 'relative',
        display: 'flex',
      }}
    >
      <Box
        ref={cellDiv}
        sx={{
          height: 1,
          width,
          display: 'block',
          position: 'absolute',
          top: 0,
        }}
      />
      <Box
        ref={cellValue}
        sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {value}
      </Box>
      {showPopper && (
        <Popper
          open={showFullCell && anchorEl !== null}
          anchorEl={anchorEl}
          style={{ width, marginLeft: -17 }}
        >
          <Paper
            elevation={1}
            style={{
                minHeight: wrapper.current.offsetHeight - 3,
                backgroundColor: 'rgba(255,255,255,0.9)'
          }}
          >
            <Typography variant="body2" style={{ padding: 8, overflowWrap: 'break-word'}}>
              {value}
            </Typography>
          </Paper>
        </Popper>
      )}
    </Box>
  );
});

function renderCellExpand(params) {
  return (
    <GridCellExpand value={params.value || ''} width={params.colDef.computedWidth} />
  );
}


const ROITable = ({roiMeta, updateFn}) => {

    const [pageSize, setPageSize] = useState(10);
    const renderData = [];
    roiMeta.map((d, i) => {
        let row = JSON.parse(d["meta"]);
        row['id'] = i
        row['roi_id'] = d.roi_id
        renderData.push(row);
    });

    const getColumns = useCallback((data) => {
        let roiCol = []
        const columns = [];
        let header = (data === undefined) ? ['roi_id'] : Object.keys(JSON.parse(data[0]['meta']));
        if (!header.includes("roi_id")) {
            header = ['roi_id', ...header]
        }
        header.map((h) => {
            if (h === "roi_id") {
                roiCol.push({
                    field: 'roi_id',
                    headerName: 'View ROI',
                    renderCell: (params) => {
                        let row = {...params.row};
                        delete row['id']
                        const currentROIMeta = parseROIDisplay(row)
                        return (
                            <Button
                                size="small"
                                onClick={() => updateFn(params.value, currentROIMeta)} // update ROI_ID, ROI_META
                            >View</Button>
                        )
                    },
                })
            } else if (h === "data_uuid") {
            } else {
                columns.push({
                    field: h,
                    width: 150,
                    headerName: h.replace(/^\w/, (c) => c.toUpperCase()),
                    renderCell: renderCellExpand,
                });
            }
        });
        return [...roiCol, ...columns];
    }, [updateFn]);

    const columns = useMemo(() => getColumns(roiMeta), [roiMeta, getColumns]);


    return <div style={{ height: '400px', width: '100%' }}><DataGrid
        density="compact"
        sx={{
            border: 'none',
        }}
        rows={renderData}
        columns={columns}
        //getRowId={(row) => row.roi_id}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[10, 20, 50]}
        components={{
            Toolbar: GridToolbar,
        }}
    /></div>

}

export default ROITable;