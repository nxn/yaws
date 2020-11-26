import { createMuiTheme } from '@material-ui/core/styles';

export const light  = createMuiTheme({
    palette: {
        mode: 'light',
        primary: {
            light: '#62727b',
            main: '#37474f',
            dark: '#102027',
            contrastText: '#fff',
        },
        secondary: {
            light: '#8e99f3',
            main: '#5c6bc0',
            dark: '#26418f',
            contrastText: '#fff',
        },
    }
});

export const dark = createMuiTheme({
    palette: {
        mode: 'dark',
        primary: {
            light: '#eeffff',
            main: '#bbdefb',
            dark: '#8aacc8',
            contrastText: '#000',
        },
        secondary: {
            light: '#e6ceff',
            main: '#b39ddb',
            dark: '#836fa9',
            contrastText: '#000',
        },
    }
});

export default dark;