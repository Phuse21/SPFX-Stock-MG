import { ISearchBox, SearchBox } from '@fluentui/react/lib/SearchBox';
import * as React from 'react';
import { Text } from '@fluentui/react/lib/Text';
import { css } from '@fluentui/react/lib/Utilities';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { theme } from '../../common/style';

const styles = mergeStyleSets({
    listSearchbox: {
        position: 'relative',
    },
    searchCover: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: 44,
        cursor: 'pointer',
    },
    searchCoverHover: {
        selectors: {
            '&:hover': {
                backgroundColor: theme.palette.neutralLight,
            },
        },
    },
    searchBoxCaption: {
        padding: '0 5px 1px 4px',
        pointerEvents: 'none',
    },
});

export interface ICammandBarSearchProps {
    placeholder?: string;
    onSearchChange: (value?: string) => void;
}

export const CammandBarSearch: React.FC<ICammandBarSearchProps> = (props) => {
    const { placeholder } = props;
    const [hasFocus, setHasFocus] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState<string>();
    const ref = React.useRef<ISearchBox>(null);
    const searchStyles = {
        root: {
            width: hasFocus ? "220px" : "32px",
            borderWidth: hasFocus ? 1 : 0,
            backgroundColor: "transparent"
        },
        field: {
            opacity: hasFocus ? 1 : 0
        },
        icon: { cursor: "pointer" }
    };
    const onSearchChanged = (event: any, term?: string): void => {
        setSearchTerm(term);
        props.onSearchChange(term);
    }
    const focusLost = (): void => {
        if (hasFocus && searchTerm) {
            return;
        }
        setHasFocus(!hasFocus);
    };
    const onCoverClicked = (): void => {
        if (!hasFocus) {
            setHasFocus(!hasFocus);
        }
    }
    React.useEffect(() => {
        if (hasFocus && ref.current) {
            ref.current.focus()
        }
    });

    return (<div className={hasFocus ? styles.listSearchbox : css(styles.listSearchbox, styles.searchCoverHover)}>
        <div onClick={onCoverClicked} className={styles.searchCover}>
            <SearchBox placeholder={placeholder}
                // @ts-ignore
                showIcon={true}
                className="searchBox" styles={searchStyles} onChange={onSearchChanged} value={searchTerm} onBlur={focusLost} componentRef={ref} />
            {!hasFocus && <Text block className={styles.searchBoxCaption}>Search</Text>}
        </div>
    </div>);
}