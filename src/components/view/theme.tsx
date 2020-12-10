import React from 'react';

import { createMuiTheme } from '@material-ui/core/styles';

import { Slide, SlideProps } from '@material-ui/core';

let modalRoot: null | HTMLElement = null;

type TPosition = { 
    vertical: "top" | "bottom",
    horizontal: "center" | "left" | "right"
}

type TVariant = "filled" | "standard" | "outlined";

const defaultProps = {
    MuiAlert: {
        defaultProps: {
            variant: 'filled' as TVariant,
            elevation: 6
        }
    },
    MuiSnackbar: {
        defaultProps: {
            anchorOrigin: { vertical: 'bottom', horizontal: 'center' } as TPosition,
            TransitionComponent: (props: SlideProps) => <Slide direction="up" {...props} />,
            autoHideDuration: 3000 
        }
    },
    MuiPopover: {
        defaultProps: {
            container: () => {
                if (!modalRoot) {
                    modalRoot = document.getElementById("modal-root")
                }
                return modalRoot;
            }
        }
    }
};

export const light  = createMuiTheme({
    components: defaultProps,
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
    components: defaultProps,
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

/* theme.palattes used on material-ui.com
const paletteDark = {
    common:{black:"#000",white:"#fff"},
    type:"dark",
    primary:{main:"#90caf9",light:"rgb(166, 212, 250)",dark:"rgb(100, 141, 174)",contrastText:"rgba(0, 0, 0, 0.87)"},
    secondary:{main:"#f48fb1",light:"rgb(246, 165, 192)",dark:"rgb(170, 100, 123)",contrastText:"rgba(0, 0, 0, 0.87)"},
    error:{light:"#e57373",main:"#f44336",dark:"#d32f2f",contrastText:"#fff"},
    warning:{light:"#ffb74d",main:"#ff9800",dark:"#f57c00",contrastText:"rgba(0, 0, 0, 0.87)"},
    info:{light:"#64b5f6",main:"#2196f3",dark:"#1976d2",contrastText:"#fff"},
    success:{light:"#81c784",main:"#4caf50",dark:"#388e3c",contrastText:"rgba(0, 0, 0, 0.87)"},
    grey:{50:"#fafafa",100:"#f5f5f5",200:"#eeeeee",300:"#e0e0e0",400:"#bdbdbd",500:"#9e9e9e",600:"#757575",700:"#616161",800:"#424242",900:"#212121",A100:"#d5d5d5",A200:"#aaaaaa",A400:"#303030",A700:"#616161"},
    contrastThreshold:3,
    tonalOffset:0.2,
    text:{primary:"#fff",
    secondary:"rgba(255, 255, 255, 0.7)",
    disabled:"rgba(255, 255, 255, 0.5)",
    hint:"rgba(255, 255, 255, 0.5)",
    icon:"rgba(255, 255, 255, 0.5)"},
    divider:"rgba(255, 255, 255, 0.12)",
    background:{paper:"#424242",default:"#121212",level2:"#333",level1:"#212121"},
    action:{active:"#fff",hover:"rgba(255, 255, 255, 0.08)",hoverOpacity:0.08,selected:"rgba(255, 255, 255, 0.16)",selectedOpacity:0.16,disabled:"rgba(255, 255, 255, 0.3)",disabledBackground:"rgba(255, 255, 255, 0.12)",disabledOpacity:0.38,focus:"rgba(255, 255, 255, 0.12)",focusOpacity:0.12,activatedOpacity:0.24}
};

const paletteLight = {
    common:{black:"#000",white:"#fff"},
    type:"light",
    primary:{main:"#1976d2",light:"rgb(71, 145, 219)",dark:"rgb(17, 82, 147)",contrastText:"#fff"},
    secondary:{main:"rgb(220, 0, 78)",light:"rgb(227, 51, 113)",dark:"rgb(154, 0, 54)",contrastText:"#fff"},
    error:{light:"#e57373",main:"#f44336",dark:"#d32f2f",contrastText:"#fff"},
    warning:{light:"#ffb74d",main:"#ff9800",dark:"#f57c00",contrastText:"rgba(0, 0, 0, 0.87)"},
    info:{light:"#64b5f6",main:"#2196f3",dark:"#1976d2",contrastText:"#fff"},
    success:{light:"#81c784",main:"#4caf50",dark:"#388e3c",contrastText:"rgba(0, 0, 0, 0.87)"},
    grey:{50:"#fafafa",100:"#f5f5f5",200:"#eeeeee",300:"#e0e0e0",400:"#bdbdbd",500:"#9e9e9e",600:"#757575",700:"#616161",800:"#424242",900:"#212121",A100:"#d5d5d5",A200:"#aaaaaa",A400:"#303030",A700:"#616161"},
    contrastThreshold:3,
    tonalOffset:0.2,
    text:{primary:"rgba(0, 0, 0, 0.87)",
    secondary:"rgba(0, 0, 0, 0.54)",
    disabled:"rgba(0, 0, 0, 0.38)",
    hint:"rgba(0, 0, 0, 0.38)"},
    divider:"rgba(0, 0, 0, 0.12)",
    background:{paper:"#fff",default:"#fff",level2:"#f5f5f5",level1:"#fff"},
    action:{active:"rgba(0, 0, 0, 0.54)",hover:"rgba(0, 0, 0, 0.04)",hoverOpacity:0.04,selected:"rgba(0, 0, 0, 0.08)",selectedOpacity:0.08,disabled:"rgba(0, 0, 0, 0.26)",disabledBackground:"rgba(0, 0, 0, 0.12)",disabledOpacity:0.38,focus:"rgba(0, 0, 0, 0.12)",focusOpacity:0.12,activatedOpacity:0.12}
}
*/