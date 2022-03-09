import {Container} from "@mui/material";

const ContentBox = ({ children }) => {
    return <Container sx={{
        border: 1,
        borderColor: "divider",
        px: 4,
        py: 2,
    }}>
        {children}
    </Container>
}

export default ContentBox;