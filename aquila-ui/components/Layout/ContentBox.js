import {Container} from "@mui/material";

const ContentBox = ({sx, children}) => {
    return <Container sx={{
        border: 1,
        borderColor: "divider",
        px: 4,
        py: 2,
        ...sx,
    }}>
        {children}
    </Container>
}

export default ContentBox;