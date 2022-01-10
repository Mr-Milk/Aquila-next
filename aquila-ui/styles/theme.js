import {createTheme, responsiveFontSizes} from "@mui/material/styles";
import {lightBlue, orange} from "@mui/material/colors";

// Create a theme instance.
let theme = createTheme({
    palette: {
        primary: orange,
        secondary: lightBlue,
    },
    // typography: {
    //     fontFamily: ['Raleway', 'Roboto', 'Arial', '-apple-system'].join(',')
    // }
});

theme = responsiveFontSizes(theme);

export default theme;