import Stack from "@mui/material/Stack"

const innerSX = {
    px: 3,
    pb: 3,
    borderRight: 1,
    borderColor: 'divider',
    minWidth: "280px",
    minHeight: '100%'
}

const LeftPanel = ({sx, children}) => (
    <Stack sx={{
        ...innerSX,
        ...sx
    }}>
        {children}
    </Stack>
)

export default LeftPanel;