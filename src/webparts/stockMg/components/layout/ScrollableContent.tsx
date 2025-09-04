import * as React from 'react';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';

const classNames = mergeStyleSets({
    root: {
        position: 'relative',
        overflowY: 'auto',
        flex: 1,
        background: 'white'
    }
});

export interface IScrollableContentProps {
    style?: React.CSSProperties;
}

export const ScrollableContent: React.FC<IScrollableContentProps> = (props) => {
    return (<div className={classNames.root} data-is-scrollable="true" style={props.style}>
        {/* <div className={classNames.innerContent}> */}
            {props.children}
        {/* </div> */}
    </div>);
}