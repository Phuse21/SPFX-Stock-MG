import { and, query, rowLimit, sanitizeQuery, textField, view, where } from 'caml4js';
import * as React from 'react';
import NavigationStore from '../../layout/navigationStore';
import { CustomerItem, CustomersList } from '../../../common/model';
import { ClickableColumn, Column, ListView, PageTitle, QueryObject, TextColumn, TextRenderer, useList } from 'spfx-addon';
import { IColumn, ProgressIndicator, SelectionMode } from '@fluentui/react';
import * as strings from 'StockMgWebPartStrings';
import { ICommandBarItemPropsExt } from '../../../common/types';
import { CammandBarSearch } from '../../commandBar/CommandBarSearch';
import { Content } from '../../layout/Content';
import { CustomCommandBar } from '../../commandBar/CustomCommandBar';
import { progressBarStyles } from '../../../common/style';
import { ScrollableContent } from '../../layout/ScrollableContent';
import { CustomerPageView } from './CustomerPageView';



type view = "Individual" | "Company" | "All";

const defaultQuery = (viewName: view,  searchText?: string) : string => {
    if (viewName === "Individual") {
        if (searchText?.trim().length) {
            return sanitizeQuery(view(
                query(
                    where(
                        and(
                            textField("CustomerType").equalTo("Individual"),
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
                        textField("CustomerType").equalTo("Individual")
                    )
                ),
                rowLimit(100, true)
            ))
        }
        //company
    } else if (viewName === "Company") {
        if (searchText?.trim().length) {
            return sanitizeQuery(view(
                query(
                    where(
                        and(
                            textField("CustomerType").equalTo("Company"),
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
                        textField("CustomerType").equalTo("Company")
                    )
                ),
                rowLimit(100, true)
            ));
        }
        //all
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
} else{
    return sanitizeQuery(view(
        query(),
        rowLimit(100, true)

    ));
}
    }
}

export interface ICustomerListPageProps {
}
export const CustomerListPage: React.FC<ICustomerListPageProps> = () => {
    const currentTitle = NavigationStore.useStoreState(state => state.getCurrentTitle);
    const {push} = NavigationStore.useStoreActions(actions => actions);

    const customersList =React.useMemo(() => new CustomersList(), []);

    const viewName = React.useRef<view>("All");

    const queryObj = React.useRef<QueryObject>(
        {
            listName: customersList.Name,
            sort: {field: "ID", direction: 'Desc' },
            itemsPerPage: 100,
            viewXml: async () => defaultQuery(viewName.current),
        }
    );

    const {isLoading, items, loadData} = useList<CustomerItem>(customersList, queryObj.current);
    
    const  onRenderMissingItem = () : null => {
        loadData();
        return null;
    }  

    //search and clear handlers
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
    }

    const saveHandler = async (item: CustomerItem, updating: boolean): Promise<void> => {
        loadData(queryObj.current);
    }

    const onItemSelected = React.useCallback((item: CustomerItem): void => {
        push({
            key: `customer-view`,
            title: item.Title ?? "New Customer",
            component: <CustomerPageView customerItem={item} onAfterSave={saveHandler} />
        });
    }, [push]);


    const columns : IColumn[] = [
        ClickableColumn(strings.Customer.Title, 'Title', { minWidth: 100, maxWidth: 200 }, (item?: CustomerItem) => {
            if (item) {
                onItemSelected(item);
            }
        }),

        Column(strings.Customer.Id, 'Id', { minWidth: 100, maxWidth: 200 }, (item?: CustomerItem) => {
            if (item) {
                return <TextRenderer text={item?.Id} />;
            }
            return null;
        }),


        TextColumn(strings.Customer.PhoneNumber, 'PhoneNumber', { minWidth: 100, maxWidth: 200 }),
        TextColumn(strings.Customer.CustomerType, 'CustomerType', { minWidth: 100, maxWidth: 200 }),
        TextColumn(strings.Customer.TotalOrders, 'TotalOrders', { minWidth: 100, maxWidth: 200 }),



    ] ;

    const commandBarItems: ICommandBarItemPropsExt[] = [
        {
            key: 'new',
            iconProps: { iconName: 'Add' },
            text: strings.Add,
            visible: true,
            onClick: () => {
                const newItem = customersList.createItem();
                onItemSelected(newItem);
            }
        },

            {
                key: 'refresh',
                iconProps: { iconName: 'Refresh' },
                onClick: () => {loadData(queryObj.current)},
                text: strings.Refresh,
                visible: true,
            }, 
    ];

    const farItems: ICommandBarItemPropsExt[] = [
        {
            key: 'view',
            iconProps: { 
  iconName: 
    viewName.current === "All" 
      ? "Group" 
      : (viewName.current === "Individual" 
          ? "Contact" 
          : "CityNext") 
},
            subMenuProps: {
                items: [
                    {
                        key: 'all',
                        text: 'All',
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
                        key: 'individual',
                        text: 'Individual',
                        canCheck: true,
                        isChecked: viewName.current === "Individual",
                        onClick: () => {
                            viewName.current = "Individual";
                            queryObj.current.viewXml = async () => {
                                return defaultQuery(viewName.current);
                            };
                            loadData(queryObj.current);
                        }
                    },

                    {
                        key: 'company',
                        text: 'Company',
                        canCheck: true,
                        isChecked: viewName.current === "Company",
                        onClick: () => {
                            viewName.current = "Company";
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
    {
        key: 'search',
        iconProps: { iconName: 'Search' },
        visible: true,
        onRender: () => <CammandBarSearch placeholder="Search customers" onSearchChange={onSearchChange} />,
    }
    ]


    return (
       <Content>
        <CustomCommandBar items={commandBarItems} />
        <PageTitle breadrumb={<span style={{fontSize: "1.25rem", fontWeight: "600"}}>{currentTitle}</span>} component={<CustomCommandBar items={farItems} showBorder={false} />} />

        {(isLoading) && <ProgressIndicator styles={progressBarStyles} />}
        <ScrollableContent>
            <ListView<CustomerItem> 
                items={items}
                columns={columns}
                onRenderMissingItem={onRenderMissingItem}
                selectionMode={SelectionMode.none}
                emptyMessage={strings.NotItemsFound}
                isLoading={isLoading}
            />
        </ScrollableContent>
       </Content>
    );
};