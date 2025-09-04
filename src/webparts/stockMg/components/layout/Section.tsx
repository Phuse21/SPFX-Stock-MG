import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import * as React from 'react';

const classNames = mergeStyleSets({
    col: {
        marginRight: "0.571428rem",
        marginLeft: "0.571428rem",
        minWidth: 340,
        display: 'block',
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 0.3px 0.9px, rgba(0, 0, 0, 0.13) 0px 1.6px 3.6px",
        borderRadius: 4,
        backgroundColor: "rgb(255, 255, 255)",
        borderStyle: "solid",
        paddingRight: "1.143rem",
        paddingLeft: "1.143rem",
        paddingBottom: "1.143rem",
        paddingTop: "0.285714rem",
        marginBottom: "1.143rem",
        borderWidth: 0,
        h2: {
            borderBottom: "1px solid rgb(237, 235, 233)",
            padding: "4px 2px 8px",
            whiteSpace: "pre-wrap",
            overflow: "hidden",
            outline: "none",
            lineHeight: 20,
            fontWeight: 500,
            fontSize: 14,
            textOverflow: "ellipsis",
            marginTop: 0,
        }
    },
    colSpan3: {
        flex: "3.3 1 0%"
    },
    colSpan4: {
        flex: "4.2 1 0%"
    },
    colSpan2: {
        flex: "2.5 1 0%"
    },
    full: {
        flex: 1
    }
})
export interface ISectionProps {
    header?: string,
    span?: 2 | 3 | 4
}

export const Section: React.FC<ISectionProps> = (props) => {
    const { header, span, children} = props;
    let className = classNames.col;
    switch (span) {
        case 2:
            className += " " + classNames.colSpan2;
            break;
        case 3:
            className += " " + classNames.colSpan3;
            break;
        case 4:
            className += " " + classNames.colSpan4;
            break;
        default:
            className += " " + classNames.full;
    }
    return (<section className={className}>
        {header && <h2>{header}</h2>}
        {children}
    </section>);
}