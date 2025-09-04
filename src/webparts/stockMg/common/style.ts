import { IDialogContentStyles } from "@fluentui/react/lib/Dialog";
import { IModalStyles } from "@fluentui/react/lib/Modal";
import { createTheme, ITheme, mergeStyleSets } from "@fluentui/react/lib/Styling";
import { PartialTheme } from "@fluentui/react/lib/Theme";
import { memoizeFunction } from "@fluentui/react/lib/Utilities";


const themeColorsFromWindow: any = (window as any).__themeState__.theme;
export const theme: ITheme = createTheme({
  palette: themeColorsFromWindow
});

export const modalPropsStyles = { main: { maxWidth: 450 } };

export const PanelStyles = {
  commands: {
    borderBottom: "1px solid #edebe9"
  },
  header: {
    paddingTop: "10px",
    paddingBottom: "10px",
    borderBottom: "1px solid #edebe9",
    width: "100%",
    paddingLeft: "35px"
  }
}

export const PanelWidth = '672px';
export const dlgStyles = { main: { width: "493px !important" } };
export const dlgIframeStyles = {
  main: { width: "80% !important", height: '80%' },
};

export const dlgIframeContentStyles: Partial<IDialogContentStyles> = {
  content: { display: "flex", flexDirection: "column", alignItems: "stretch", height: '100%' },
  inner: { flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "stretch" },
  innerContent: { flexGrow: 1 }
}

export const dlgIframeModalStyles: Partial<IModalStyles> = {
  scrollableContent: { overflow: "hidden" }
}

const getClassNames = memoizeFunction(() => {
  return mergeStyleSets({
    formikForm: {
      width: "100%"
    },
    dlgContent: {
      maxHeight: '100%',
      maxWidth: '100%',
      overflow: 'hidden',
    },
    mt10: {
      marginTop: 10
    },
    overflowHidden: {
      overflow: "hidden"
    },
    ellipsis: {
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    scrollY: {
      overflowY: "auto",
      overflowX: "hidden"
    },
    contentPane: {
      width: '100%',
      alignItems: "stretch",
      minWidth: 1
    },
    scroller: {
      scrollbarColor: `${theme.palette.neutralSecondary} transparent`
    },
    card: {
      // boxShadow: "0 0 2px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.14)",
      borderRadius: 4,
      backgroundColor: theme.palette.white,
      border: '1px solid #ebebeb'
    },
    cardPadding: {
      padding: '10px 12px',
    },
    fullWidthAndHeight: {
      width: "100%",
      height: "100%"
    },
    fullHeight: {
      height: "100%"
    },
    fullWidth: {
      width: "100%"
    },
    checkboxCell: {
      selectors: {
        "> div": {
          width: 32
        }
      }
    },
    detailList: {
      overflowX: "hidden",
      overflowY: "auto",
      backgroundColor: theme.palette.white
    },
    whiteBackground: {
      backgroundColor: theme.palette.white
    },
    flexWidthFix: {
      minWidth: 0
    },
    contextualMenuItem: {
      padding: 5
    },
    nonSelectableList: {
      paddingLeft: 48
    },
    focusZone: {
      height: '100%',
      overflowY: 'auto',
      overflowX: 'hidden',
    },
    centerSpinner: {//spinner in center of the screen
      minHeight: 400,
      minWidth: 400,
      position: "relative",
      selectors: {
        ".ms-Spinner": {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }
      }
    },
    iframeContainer: {
      // overflow   : hidden;
      // position   : relative;
      height: '100%',
      selectors: {
        'iframe': {
          border: 0,
          height: '800px',
          width: '100%',
        }
      }
    }

  })
});

export const commonClassNames = getClassNames();

//set data-is-scrollable attribute on DetailList
export const focusZoneProps = {
  className: commonClassNames.focusZone,
  'data-is-scrollable': 'true',
} as React.HTMLAttributes<HTMLElement>;

export const stylesHorizontalSepartor = {
  root: {
    padding: 0,
    height: 4,
    backgroundColor: theme.palette.white
  }
};

export const stylesScroller = {
  root: {
    scrollbarColor: `${theme.palette.neutralSecondary} transparent`
  }
}

//Card styles for Stack 
export const stylesCard = {
  root: {
    // boxShadow: "0 0 2px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.14)",
    borderRadius: 4,
    backgroundColor: theme.palette.white,
    // border: '1px solid #ebebeb'
  }
}

export const stylesCardWidthPadding = {
  root: {
    // boxShadow: "0 0 2px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.14)",
    borderRadius: 4,
    backgroundColor: theme.palette.white,
    // border: '1px solid #ebebeb',
    padding: "10px 12px"
  }
}

export const stylesCardWidthHorizontalPadding = {
  root: {
    // boxShadow: "0 0 2px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.14)",
    borderRadius: 4,
    backgroundColor: theme.palette.white,
    // border: '1px solid #ebebeb',
    padding: "0 12px"
  }
}

//theme
export const transparentTheme: PartialTheme = {
  palette: {
    white: "#0",
    themePrimary: theme.semanticColors.bodyText,
  }
};

//progress bar styles
export const progressBarStyles = {
  itemProgress: {
    padding: 0
  }
}

//SearchBar styles
export const searchStyles = {
  iconContainer: {
    color: 'inherit'
  },
  icon: { cursor: "pointer" },
  root: {
    borderColor: '#ccc'
  },
  field: {
    '::placeholder': {
      fontSize: 12
    }
  }
};

//Filter and Sort button styles
export const filterSortButtonStyles = {
  menuIcon: {
    display: 'none'
  },
  root: {
    minWidth: 'auto'
  }
};

export const boldText = {
  root: {
    fontWeight: '600'
  }
}
