import { and, query, rowLimit, sanitizeQuery, textField, view, where } from "caml4js";
import * as React from "react";
import NavigationStore from "../../layout/navigationStore";
import { OrderItem, OrdersList } from "../../../common/model";
import { ClickableColumn, Column, ListView, NumberColumn, PageTitle, QueryObject, TextColumn, TextRenderer, useList } from "spfx-addon";
import { IColumn, ProgressIndicator, SelectionMode } from "@fluentui/react";
import * as strings from "StockMgWebPartStrings";
import { ICommandBarItemPropsExt } from "../../../common/types";
import { CammandBarSearch } from "../../commandBar/CommandBarSearch";
import { Content } from "../../layout/Content";
import { CustomCommandBar } from "../../commandBar/CustomCommandBar";
import { progressBarStyles } from "../../../common/style";
import { ScrollableContent } from "../../layout/ScrollableContent";
import { OrdersPageView } from "./OrdersPageView";


type View = "Confirmed" | "Delivered" | "Cancelled" | "All";

const defaultQuery = (viewName: View, searchText?: string): string => {
    if (viewName === "Confirmed") {
        if (searchText?.trim().length) {
            return sanitizeQuery(view(
                query(
                    where(
                        and(
                            textField("Status").equalTo("Confirmed"),
                            textField("Title").contains(searchText)
                        )
                    )
                ),
                rowLimit(100, true)
            ))
        } else{
            return sanitizeQuery(view(
                query(
                    where(
                        textField("Status").equalTo("Confirmed")
                    )
                ),
                rowLimit(100, true)
            ))
        }
    } else if (viewName === "Delivered") {
        if (searchText?.trim().length) {
            return sanitizeQuery(view(
                query(
                    where(
                        and(
                            textField("Status").equalTo("Delivered"),
                            textField("Title").contains(searchText)
                        )
                    )
                ),
                rowLimit(100, true)
            ))
        } else {
            return sanitizeQuery(view(
                query(
                    where(
                        textField("Status").equalTo("Delivered")
                    )
                ),
                rowLimit(100, true)
            ))
        }
    } else if (viewName === "Cancelled") {
        if (searchText?.trim().length) {
            return sanitizeQuery(view(
                query(
                    where(
                        and(
                            textField("Status").equalTo("Cancelled"),
                            textField("Title").contains(searchText)
                        )
                    )
                ),
                rowLimit(100, true)
            ))
        } else {
            return sanitizeQuery(view(
                query(
                    where(
                        textField("Status").equalTo("Cancelled")
                    )
                ),
                rowLimit(100, true)
            ))
        }
    } else {
        if (searchText?.trim().length) {
            return sanitizeQuery(view(
                query(
                    where(
                        textField("Title").contains(searchText)
                    )
                ),
                rowLimit(100, true)
            ))
        } else {
            return sanitizeQuery(view(
                query(),
                rowLimit(100, true)
            ))
        }
    }
}


export interface IOrdersListPageProps {
   
}

export const OrdersListPage: React.FC<IOrdersListPageProps> = (props) => {
const currentPageTitle = NavigationStore.useStoreState(state => state.getCurrentTitle);

const {push} = NavigationStore.useStoreActions(action => action);

const orderList = React.useMemo(() => new OrdersList(), []);
const viewName = React.useRef<View>("All");
const queryObj = React.useRef<QueryObject>(
    {
        listName: orderList.Name,
        sort: { field: 'Id', direction: 'Desc'},
        itemsPerPage: 100,
        viewXml: async () => defaultQuery(viewName.current),
    }
);

const {isLoading, loadData, items} = useList<OrderItem>(orderList, queryObj.current);

const onRenderMissingItem = (): null => {
    loadData();
    return null;
};

// search / clear handlers
const onClear = (): void => {
    queryObj.current.viewXml = async () => defaultQuery(viewName.current);
    loadData(queryObj.current);
};

const onSearchChange = (newValue?: string): void => {
    if (!newValue) return onClear();
    if (!isLoading) {
        queryObj.current.viewXml = async () => defaultQuery(viewName.current, newValue);
        loadData(queryObj.current);
    }
};


const saveHandler = (orderItem: OrderItem, updating: boolean): Promise<void> => {
    return loadData(queryObj.current);
}

const onItemSelected = React.useCallback((item: OrderItem): void => {
    push({
        key: `order/${item.Id}`,
        title: `Order #${item.Id}`,
        component: <OrdersPageView orderItem={item} onAfterSave={saveHandler}/>
    })
}, [push]);

const columns : IColumn[] = [
    ClickableColumn(strings.Order.Title, 'Title', { minWidth: 100, maxWidth: 200 }, (item?: OrderItem) => {
        if (item) {
            onItemSelected(item);
        }
    }),

    // FIXED: Handle lookup field objects properly
    Column(strings.Order.Customer, 'Customer', { minWidth: 100, maxWidth: 200 }, (item?: OrderItem) => {
        if (item) {
            const customerTitle = item.getCustomerTitle();
            return <TextRenderer text={customerTitle || 'N/A'} />;
        }
        return null;
    }),
    
    // FIXED: Handle lookup field objects properly
    Column(strings.Order.Item, 'Item', { minWidth: 100, maxWidth: 200 }, (item?: OrderItem) => {
        if (item) {
            const itemTitle = item.getItemTitle();
            return <TextRenderer text={itemTitle || 'N/A'} />;
        }
        return null;
    }),

    NumberColumn(strings.Order.QuantityOrdered, 'QuantityOrdered', { minWidth: 100, maxWidth: 200 }),
     Column(strings.Order.UnitPrice, 'UnitPrice', { minWidth: 120, maxWidth: 180 }, (item?: OrderItem) => {
        if (item && item.UnitPrice !== undefined && item.Currency) {
            const formattedPrice = `${item.Currency} ${item.UnitPrice.toLocaleString()}`;
            return <TextRenderer text={formattedPrice} />;
        } else if (item && item.UnitPrice !== undefined) {
            // Fallback if currency is not available
            return <TextRenderer text={item.UnitPrice.toString()} />;
        }
        return null;
    }),
    Column(strings.Order.TotalPrice, 'TotalPrice', { minWidth: 120, maxWidth: 180 }, (item?: OrderItem) => {
    if (item) {
        // Try to use the stored TotalPrice first, fall back to calculation if needed
        let totalPrice = item.TotalPrice;
        
        // If TotalPrice is not available or seems incorrect, calculate it
        if (!totalPrice || totalPrice === 0) {
            totalPrice = item.calculateTotalPrice();
        }
        
        if (totalPrice && totalPrice > 0 && item.Currency) {
            const formattedPrice = `${item.Currency} ${totalPrice.toLocaleString()}`;
            return <TextRenderer text={formattedPrice} />;
        } else if (totalPrice && totalPrice > 0) {
            return <TextRenderer text={totalPrice.toString()} />;
        }
    }
    return null;
}),
    TextColumn(strings.Order.OrderStatus, 'OrderStatus', { minWidth: 100, maxWidth: 200 }),
];

const commandBaritems: ICommandBarItemPropsExt[] = [
        {
            key: 'new',
            iconProps: { iconName: 'Add' },
            onClick: () => {
                const newItem = new OrderItem();
              
                newItem.OrderDate = new Date();
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
           iconProps: { 
  iconName: 
    viewName.current === "All"
      ? "Group"
      : (viewName.current === "Confirmed"
          ? "CheckMark"
          : (viewName.current === "Delivered"
              ? "DeliveryTruck"
              : "Cancel"))
},
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
                        key: 'confirmed',
                        text: "Confirmed",
                        canCheck: true,
                        isChecked: viewName.current === "Confirmed",
                        onClick: () => {
                            viewName.current = "Confirmed";
                            queryObj.current.viewXml = async () => {
                                return defaultQuery(viewName.current);
                            };
                            loadData(queryObj.current);
                        }
                    },
                    {
                        key: 'delivered',
                        text: "Delivered",
                        canCheck: true,
                        isChecked: viewName.current === "Delivered",
                        onClick: () => {
                            viewName.current = "Delivered";
                            queryObj.current.viewXml = async () => {
                                return defaultQuery(viewName.current);
                            };
                            loadData(queryObj.current);
                        }
                    },
                    {
                        key: 'cancelled',
                        text: "Cancelled",
                        canCheck: true,
                        isChecked: viewName.current === "Cancelled",
                        onClick: () => {
                            viewName.current = "Cancelled";
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
        { key: 'search', visible: true, onRender: () => <CammandBarSearch placeholder="Search stock items" onSearchChange={onSearchChange} /> }
    ];


    return (
        <Content>
            <CustomCommandBar items={commandBaritems} />
            <PageTitle breadrumb={<span style={{ fontSize: "1.25rem", fontWeight: 600 }}>{currentPageTitle}</span>}
            component={<CustomCommandBar items={farItems} showBorder={false} />} />
            
            {isLoading && <ProgressIndicator styles={progressBarStyles}/>}

            <ScrollableContent>
            <ListView<OrderItem> 
                items={items}
                columns={columns} 
                selectionMode={SelectionMode.none}
                isLoading={isLoading}
                emptyMessage={strings.NoItemsFound}
                onRenderMissingItem={onRenderMissingItem}
                />
            </ScrollableContent>

        </Content>
    );
}