import * as React from 'react';
import { INavLink, INavLinkGroup, INavStyles, Nav } from '@fluentui/react/lib/Nav';
import { PartialTheme, ThemeProvider } from '@fluentui/react/lib/Theme';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { css } from '@fluentui/react/lib/Utilities';
import { theme } from '../../common/style';

const classNames = mergeStyleSets({
  navCover: {
    borderRight: "1px solid #edebe9",
    fontSize: 14,
    fontWeight: 400,
    height: "100%",
    width: "auto",
  },
});

const navStyles: Partial<INavStyles> = {
  root: {
    width: 200,
    height: '100%',
    boxSizing: 'border-box',
    overflowY: 'auto',
    scrollbarColor: `${theme.palette.neutralSecondary} transparent`,
  },
  link: {
    height: 40,
    lineHeight: 40,
    ':hover': {
      boxShadow: "0 4px 8px rgba(0, 0, 0, .1)",
      color: theme.semanticColors.bodyText,
      i: {
        color: `${theme.semanticColors.bodyText} !important`,
      },
    },
    i: {
      color: theme.semanticColors.bodyText,
      height: 40,
      lineHeight: 40,
    },
    ':after': {
      height: 24,
      top: 7,
    },
  },
};

export const navTheme: PartialTheme = {
  palette: {
    neutralLight: "#ffffff",
    neutralLighter: "#ffffff",
  },
  semanticColors: {
    bodyBackground: "#efefef",
    bodyText: theme.semanticColors.bodyText,
    linkHovered: theme.semanticColors.bodyText,
  },
};

interface SidebarProps {
  onPageSelected: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = React.memo(({ onPageSelected }) => {
  const [selectedPage, setSelectedPage] = React.useState('home');
  const isCollapsed = sessionStorage.getItem('menuCollapsed') === '1';

  const navLinkGroups: INavLinkGroup[] = [
    {
      links: [
        {
          name: 'Menu',
          url: '#!',
          key: 'menu',
          isExpanded: true,
          links: [
            {
              name: isCollapsed ? "" : 'Stock',
              url: '#!',
              key: 'home',
              icon: 'Page',
              ariaLabel: 'Stock',
            },
            {
              name: isCollapsed ? "" : 'Customers',
              url: '#!',
              key: 'customers',
              icon: 'Contact',
              ariaLabel: 'Customers',
            },
            {
              name: isCollapsed ? "" : 'Orders',
              url: '#!',
              key: 'orders',
              icon: 'ShoppingCart',
              ariaLabel: 'Orders',
            },
          ],
        },
      ],
    },
  ];

  const _onLinkClick = (ev?: React.MouseEvent<HTMLElement>, item?: INavLink): void => {
    ev?.preventDefault();
    if (item && !item.links) {
      onPageSelected(item.key as string);
      setSelectedPage(item.key as string);
    }
  };

  React.useEffect(() => {
    onPageSelected(selectedPage);
  }, []);

  return (
    <ThemeProvider theme={navTheme}>
      <div className={css(classNames.navCover, isCollapsed ? 'collapsed' : '')}>
        <Nav
          onLinkClick={_onLinkClick}
          selectedKey={selectedPage}
          ariaLabel="Navigation"
          styles={navStyles}
          groups={navLinkGroups}
        />
      </div>
    </ThemeProvider>
  );
});

export default Sidebar;
