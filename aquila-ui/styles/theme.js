import {createTheme, responsiveFontSizes} from "@mui/material/styles";
import {lightBlue, orange} from "@mui/material/colors";

// Create a theme instance.
let theme = createTheme({
    palette: {
        primary: orange,
        secondary: lightBlue,
    },
    typography: {
        fontFamily: ['Infer', 'Roboto', 'Arial', '-apple-system'].join(','),
        h3: {fontWeight: 600},
        h4: {fontWeight: 500},
        h5: {fontWeight: 500},
        h6: {fontWeight: 500},
    }
});

theme = responsiveFontSizes(theme);

export default theme;