import * as React from 'react';
import { Formik, FormikProps } from 'formik';
import { noop } from '../../stock/components/Detail';
import { Stack } from '@fluentui/react';
import { commonClassNames, stylesCardWidthPadding } from '../../../../common/style';
import { FieldLookupDropdown, FieldNumber, FieldChoiceColumnDropdown } from 'spfx-addon';
import * as strings from 'StockMgWebPartStrings';
import { OrderItem, CustomersList, StockList, CustomerItem, StockItem } from '../../../../common/model';
import { IDropdownOption } from '@fluentui/react';
import { ListsEnum } from '../../../../common/types';
import { view, query, where, numberField, rowLimit, sanitizeQuery } from 'caml4js';

const gap = { childrenGap: 15 };

export interface IOrderFormProps {
    orderItem: OrderItem;
    // eslint-disable-next-line @rushstack/no-new-null
    formRef?: React.MutableRefObject<FormikProps<Record<string, any>> | null>;
    validityCallback?: (isValid: boolean) => void;
    readonly?: boolean;
}

export const OrderForm: React.FC<IOrderFormProps> = (props) => {
    const { orderItem, formRef, validityCallback = noop, readonly } = props;
    
    const [customerOptions, setCustomerOptions] = React.useState<IDropdownOption[]>([]);
    const [stockOptions, setStockOptions] = React.useState<IDropdownOption[]>([]);
    const [loading, setLoading] = React.useState(true);

    // Determine if we're editing an existing order
    const isEditing = !orderItem.isNew();

    React.useEffect(() => {
        const loadOptions = async (): Promise<void> => {
            try {
                setLoading(true);
                
                // Load customers (no filter)
                const customersList = new CustomersList();
                const customers = await customersList.getItems({
                    listName: customersList.Name,
                    sort: { field: 'Title', direction: 'Asc' },
                    itemsPerPage: 1000
                });
                
                const customerDropdownOptions: IDropdownOption[] = customers.map((customer: CustomerItem) => ({
                    key: customer.Id!,
                    text: customer.Title || '',
                    data: { Id: customer.Id, Title: customer.Title }
                }));

                // Load stock items (filter StockQuantity > 0)
                const stockList = new StockList();
                const stockItems = await stockList.getItems({
                    listName: stockList.Name,
                    sort: { field: 'Title', direction: 'Asc' },
                    itemsPerPage: 1000,
                    viewXml: async () => sanitizeQuery(
                        view(
                            query(
                                where(
                                    numberField("StockQuantity").greaterThan(0)
                                )
                            ),
                            rowLimit(1000, true)
                        )
                    )
                });

                const stockDropdownOptions: IDropdownOption[] = stockItems.map((stockItem: StockItem) => ({
                    key: stockItem.Id!,
                    text: stockItem.Title || '',
                    data: { Id: stockItem.Id, Title: stockItem.Title }
                }));

                setCustomerOptions(customerDropdownOptions);
                setStockOptions(stockDropdownOptions);
            } catch (error) {
                console.error('Error loading dropdown options:', error);
            } finally {
                setLoading(false);
            }
        };

        loadOptions();
    }, []);

    // Prepare initial values with proper Customer and StockItem objects
    const initialValues = React.useMemo(() => {
        const values = { ...orderItem.writableFields };

        if (!orderItem.isNew()) {
            // Handle Customer lookup field
            if (orderItem.Customer) {  
                const customerId = orderItem.getCustomerId();
                const customerTitle = orderItem.getCustomerTitle();
                
                if (customerId && customerTitle) {
                    values.Customer = { Id: customerId, Title: customerTitle };
                } else {
                    const customerOption = customerOptions.find(opt => 
                        opt.key.toString() === orderItem.Customer || 
                        opt.text === orderItem.Customer
                    );
                    if (customerOption) {
                        values.Customer = customerOption.data;
                    }
                }
            }
            
            // Handle Item lookup field
            if (orderItem.Item) {
                const itemId = orderItem.getItemId();
                const itemTitle = orderItem.getItemTitle();
                
                if (itemId && itemTitle) {
                    values.StockItem = { Id: itemId, Title: itemTitle };
                } else {
                    const stockOption = stockOptions.find(opt => 
                        opt.key.toString() === orderItem.Item || 
                        opt.text === orderItem.Item
                    );
                    if (stockOption) {
                        values.StockItem = stockOption.data;
                    }
                }
            }
        }

        console.log("Initial form values (computed once):", values);
        return values;
    }, [orderItem, customerOptions, stockOptions]);
    
    return (
        <Formik
            validateOnMount={true}
            initialValues={initialValues}
            enableReinitialize={true}
            validationSchema={orderItem.validate()}
            innerRef={formRef}
            onSubmit={noop}>
            {({ isValid }: FormikProps<any>) => {
                validityCallback(isValid);

                return (
                    <Stack styles={stylesCardWidthPadding}>
                        <div className={commonClassNames.formikForm}>
                            <Stack tokens={gap} style={{ minWidth: "50%", maxWidth: 400 }}>
                                
                                {/* Customer Lookup */}
                                <Stack.Item>
                                    <FieldLookupDropdown
                                        name="Customer"
                                        label={strings.Order.Customer}
                                        required
                                        disabled={readonly || loading || isEditing}
                                        options={customerOptions}
                                    />
                                </Stack.Item>
                                
                                {/* Stock Item Lookup */}
                                <Stack.Item>
                                    <FieldLookupDropdown
                                        name="StockItem"
                                        label={strings.Order.Item}
                                        required
                                        disabled={readonly || loading || isEditing}
                                        options={stockOptions}
                                    />
                                </Stack.Item>
                                
                                {/* Quantity Ordered */}
                                <Stack.Item>
                                    <FieldNumber
                                        name="QuantityOrdered"
                                        label={strings.Order.QuantityOrdered}
                                        required
                                        disabled={readonly || isEditing}
                                        min={1}
                                    />
                                </Stack.Item>
                                
                                {/* Order Status - Only show for editing existing orders */}
                                {isEditing && (
                                    <Stack.Item>
                                       <FieldChoiceColumnDropdown
                                            name="OrderStatus"
                                            label={strings.Stock.ItemCategory}
                                            listName={ListsEnum.Orders}
                                            disabled={readonly}
                                            required
                                        />
                                    </Stack.Item>
                                )}
                                
                            </Stack>
                        </div>
                    </Stack>
                );
            }}
        </Formik>
    );
};
