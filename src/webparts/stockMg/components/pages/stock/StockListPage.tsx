import { and, numberField, query, rowLimit, sanitizeQuery, textField, view, where } from 'caml4js';
import * as React from 'react';
import { StockItem, StockList } from '../../../common/model';
import { ClickableColumn, Column, ListView, NumberColumn, PageTitle, QueryObject, TextColumn, TextRenderer, useList } from 'spfx-addon';
import NavigationStore from '../../layout/navigationStore';
import { IColumn, ProgressIndicator, SelectionMode } from '@fluentui/react';
import * as strings from 'StockMgWebPartStrings';
import { ICommandBarItemPropsExt } from '../../../common/types';
import { CammandBarSearch } from '../../commandBar/CommandBarSearch';
import { Content } from '../../layout/Content';
import { progressBarStyles } from '../../../common/style';
import { ScrollableContent } from '../../layout/ScrollableContent';
import { CustomCommandBar } from '../../commandBar/CustomCommandBar';
import { StockPageView } from './StockPageView';

 
type View = "In Stock" | "Out of Stock" | "All";

const defaultQuery = (viewName: View, searchText?: string): string => {
    if (viewName === "In Stock") {
        if (searchText?.trim().length) {
            return sanitizeQuery(view(
                query(
                    where(
                        and(
                            numberField("StockQuantity").greaterThan(0),
                            textField("Title").contains(searchText)
                        )
                    )
                ),
                rowLimit(100, true)
            ));
        } else {
            return sanitizeQuery(view(
                query(
                    where(
                        numberField("StockQuantity").greaterThan(0)
                    )
                ),
                rowLimit(100, true)
            ));
        }
    }
    else if (viewName === "Out of Stock") {
        if (searchText?.trim().length) {
            return sanitizeQuery(view(
                query(
                    where(
                        and(
                            numberField("StockQuantity").equalTo(0),
                            textField("Title").contains(searchText)
                        )
                    )
                ),
                rowLimit(100, true)
            ));
        } else {
            return sanitizeQuery(view(
                query(
                    where(
                        numberField("StockQuantity").equalTo(0)
                    )
                ),
                rowLimit(100, true)
            ));
        }
    }
    else { // "All"
        if (searchText?.trim().length) {
            return sanitizeQuery(view(
                query(
                    where(
                        textField("Title").contains(searchText)
                    )
                ),
                rowLimit(100, true)
            ));
        } else {
            return sanitizeQuery(view(
                query(),
                rowLimit(100, true)
            ));
        }
    }
};



export interface IStockListPageProps {
}

export const StockListPage: React.FC<IStockListPageProps> = () => {
const currentTitle = NavigationStore.useStoreState(state => state.getCurrentTitle);
const { push } = NavigationStore.useStoreActions(actions => actions);

    const stockList = React.useMemo(() => new StockList(), []);
    const viewName = React.useRef<View>("In Stock");
    const queryObj = React.useRef<QueryObject>(
        {
            listName: stockList.Name,
            sort: { field: "ID", direction: 'Desc' },
            itemsPerPage: 100,
            viewXml: async () => defaultQuery(viewName.current),
        }
    );

    const {isLoading, items, loadData} = useList<StockItem>(stockList, queryObj.current);
    const onRenderMissingItem = (): null => {
        loadData();
        return null;
    };

    // search / clear handlers
    const onClear = (): void => {
        queryObj.current.viewXml = async () => defaultQuery(viewName.current);
        loadData(queryObj.current);
    };
    const onSearchChanged = (text?: string): void => {
        if (!text) return onClear();
        if (!isLoading) {
            queryObj.current.viewXml = async () => defaultQuery(viewName.current, text);
            loadData(queryObj.current);
        }
    };

    const saveHandler = async (item: StockItem, updating: boolean): Promise<void> => {
        loadData(queryObj.current);
    }

    const onItemSelected = React.useCallback((item: StockItem): void => {
        push({
            key: 'stock-view',
            title: item.Title ?? "New Stock Item",
            component: <StockPageView stockItem={item} onAfterSave={saveHandler} />
        });
    }, []);


   const columns: IColumn[] = [
   ClickableColumn(strings.Stock.Title, 'Title', { minWidth: 100, maxWidth: 200 }, (item?: StockItem) => {
            if (item) {
                onItemSelected(item);
            }
        }),
     Column(strings.Stock.Id, 'Id', { minWidth: 100, maxWidth: 120 }, (item?: StockItem) => {
        if (item) {
            return <TextRenderer text={item?.Id} />;
        }
        return null;
    }),
    NumberColumn(strings.Stock.StockQuantity, 'StockQuantity', { minWidth: 100, maxWidth: 150 }),
    // Custom currency-formatted Unit Price column
    Column(strings.Stock.UnitPrice, 'UnitPrice', { minWidth: 120, maxWidth: 180 }, (item?: StockItem) => {
        if (item && item.UnitPrice !== undefined && item.Currency) {
            const formattedPrice = `${item.Currency} ${item.UnitPrice.toLocaleString()}`;
            return <TextRenderer text={formattedPrice} />;
        } else if (item && item.UnitPrice !== undefined) {
            // Fallback if currency is not available
            return <TextRenderer text={item.UnitPrice.toString()} />;
        }
        return null;
    }),
    TextColumn(strings.Stock.ItemCategory, 'ItemCategory', { minWidth: 100, maxWidth: 150 }),
];

    const commandBaritems: ICommandBarItemPropsExt[] = [
       {
            key: 'new',
            iconProps: { iconName: 'Add' },
            onClick: () => {
                const newItem = new StockItem();
                onItemSelected(newItem);
            },
            text: strings.Add,
            visible: true,
        },
        {
            key: 'refresh',
            iconProps: { iconName: 'Refresh' },
            onClick: () => { loadData(queryObj.current) },
            text: strings.Refresh,
            visible: true,
        }
    ];

     const farItems: ICommandBarItemPropsExt[] = [
        {
            key: 'view',
            iconProps: { iconName: viewName.current === "All" ? "ViewList" : "ViewDashboard" },
            subMenuProps: {
                items: [
                    {
                        key: 'all',
                        text: "All",
                        canCheck: true,
                        isChecked: viewName.current === "All",
                        onClick: () => {
                            viewName.current = "All";
                            queryObj.current.viewXml = async () => {
                                return defaultQuery(viewName.current);
                            };
                            loadData(queryObj.current);
                        }
                    },
                    {
                        key: 'in-stock',
                        text: "In Stock",
                        canCheck: true,
                        isChecked: viewName.current === "In Stock",
                        onClick: () => {
                            viewName.current = "In Stock";
                            queryObj.current.viewXml = async () => {
                                return defaultQuery(viewName.current);
                            };
                            loadData(queryObj.current);
                        }
                    },
                    {
                        key: 'out-of-stock',
                        text: "Out of Stock",
                        canCheck: true,
                        isChecked: viewName.current === "Out of Stock",
                        onClick: () => {
                            viewName.current = "Out of Stock";
                            queryObj.current.viewXml = async () => {
                                return defaultQuery(viewName.current);
                            };
                            loadData(queryObj.current);
                        }
                    }
                ]
            },
            text: viewName.current,
            visible: true,
        },
        { key: 'search', visible: true, onRender: () => <CammandBarSearch placeholder="Search instances" onSearchChange={onSearchChanged} /> }
    ];


    return (
        <Content>
            <CustomCommandBar items={commandBaritems}/>
            <PageTitle 
      breadrumb={<span style={{ fontSize: "1.25rem", fontWeight: 600 }}>{currentTitle}</span>} 
     component={<CustomCommandBar items={farItems} showBorder={false} />}/>
     {(isLoading) && <ProgressIndicator styles={progressBarStyles} />}
     <ScrollableContent>
<ListView <StockItem> 
    items={items}
    columns={columns}
    selectionMode={SelectionMode.none}
    onRenderMissingItem={onRenderMissingItem}
    emptyMessage={strings.NoItemsFound}
    isLoading={isLoading}
    
    />



     </ScrollableContent>
        
        </Content>
    );
};