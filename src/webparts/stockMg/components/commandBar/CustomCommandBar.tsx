import * as React from 'react';
import { CommandBar, ICommandBarStyles } from '@fluentui/react/lib/CommandBar';
import { ICommandBarItemPropsExt } from '../../common/types';
import { mergeStyles } from '@fluentui/react/lib/Styling';

const commandBarStyles: ICommandBarStyles = {
    root: {
        paddingLeft: 0,
        backgroundColor: 'inherit'
    },
    primarySet: {
        "& .ms-Button:not(.primary)": {
            border: 'none',
            backgroundColor: 'transparent',
            "& .ms-Button-flexContainer": {
                height: 32,
            },
            ":hover": {
                backgroundColor: 'transparent'
            },
            ':focus': {
                backgroundColor: 'transparent'
            }
        },
        "& .ms-TooltipHost": {
            display: 'flex'
        }
    },
    secondarySet: {
        height: 32,
        minHeight: 32
    }
}

const borderStyles = mergeStyles({
    borderBottom: '1px solid #e0e0e0',
    marginBottom: 11
})

export interface ICustomCommandBarProps {
    items: ICommandBarItemPropsExt[];
    farItems?: ICommandBarItemPropsExt[];
    /**
     * @defaultValue `true`
     */
    showBorder?: boolean;
}

// Add export keyword here
export const CustomCommandBar: React.FC<ICustomCommandBarProps> = (props) => {
    const { items, farItems = [], showBorder = true } = props;
    return (
        <div className={showBorder ? borderStyles : ""}>
            <CommandBar
                items={items.filter(item => item.visible)}
                overflowButtonProps={{ ariaLabel: 'More commands' }}
                ariaLabel={'Use left and right arrow keys to navigate between commands'}
                farItems={farItems.filter(item => item.visible)}
                styles={commandBarStyles} />
        </div>
    );
}