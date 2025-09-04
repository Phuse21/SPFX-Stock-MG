import * as React from 'react';
import { mergeStyles } from '@fluentui/react/lib/Styling';

const styles = mergeStyles({
    position: 'relative',
    overflow: 'hidden',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0
});

export interface IContentProps {

}
export const Content: React.FC<IContentProps> = (props) => {
    return (
        <div className={styles} >
            {props.children}
        </div>
    )
}
