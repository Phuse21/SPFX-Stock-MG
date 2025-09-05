import { FormikProps } from "formik";
import { OrderItem, OrdersList, StockList, StockItem } from "../../../common/model";
import * as React from "react";
import { BlockedMessageBar, ConfirmDialog, DirtyChecker, PageTitle, useAsync, useBoolean } from "spfx-addon";
import NavigationStore from "../../layout/navigationStore";
import { commonClassNames, progressBarStyles } from "../../../common/style";
import * as strings from "StockMgWebPartStrings";
import { ICommandBarItemPropsExt } from "../../../common/types";
import { Content } from "../../layout/Content";
import { CustomCommandBar } from "../../commandBar/CustomCommandBar";
import { MessageBarType, ProgressIndicator } from "@fluentui/react";
import { noop } from "../stock/components/Detail";
import { ScrollableContent } from "../../layout/ScrollableContent";
import { Section } from "../../layout/Section";
import { OrderForm } from "./components/OrderForm";


export interface IOrdersPageViewProps {
    orderItem: OrderItem;
    onAfterSave: (orderItem: OrderItem, updating: boolean) => Promise<void>;
}

export const OrdersPageView: React.FC<IOrdersPageViewProps> = (props) => {

    const { orderItem } = props;
        const formRef = React.useRef<FormikProps<Record<string, any>>>(null);
        const [showDelete, { toggle: toggleDelete }] = useBoolean(false);
        const [isValid, setIsValid] = React.useState(false);
        const { pop } = NavigationStore.useStoreActions(actions => actions);


        const validityCallback = React.useCallback((isValid: boolean) => {
            setIsValid(isValid);
        }, []);

        const handleDelete = async (): Promise<void> => {
            if (!orderItem.isNew()) {
                const stockList = new StockList();
                try {

                    await stockList.deleteItemById(orderItem.Id!);
                    if (props.onAfterSave) {
                        await props.onAfterSave(orderItem, false);
                    }
                    pop();
                    
                } catch (error) {
                    console.error("Error deleting order item:", error);
                    alert(`Error deleting order item: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
            }
        }

       const [execute, pending, error] = useAsync(async () => {
    const rawValues = formRef.current!.values;
    console.log("Raw form values before processing:", rawValues);
    
    const values = { ...rawValues };
    
    // Generate random 6-digit order ID as title if it's a new order
    if (orderItem.isNew()) {
        const randomOrderId = Math.floor(100000 + Math.random() * 900000).toString();
        values.Title = randomOrderId;
        console.log("Generated order ID:", randomOrderId);
    }
    
    // FIXED: Handle lookup fields and get stock item details
    if (values.StockItem?.Id) {
        console.log("StockItem original:", values.StockItem);
        
        // Get stock item details to populate UnitPrice and Currency
        try {
            const stockList = new StockList();
            const stockItem = await stockList.getItem(values.StockItem.Id) as StockItem;
            
            if (stockItem) {
                values.UnitPrice = stockItem.UnitPrice;
                values.Currency = stockItem.Currency;
                
                console.log("Stock item details fetched:", {
                    UnitPrice: values.UnitPrice,
                    Currency: values.Currency
                });
            }
        } catch (error) {
            console.error("Error fetching stock item details:", error);
        }
        
        // For SharePoint REST API, send lookup field as object with Id property
        values.Item = { Id: values.StockItem.Id };
        console.log("Item field set to:", values.Item);
        delete values.StockItem;
    }
    
    if (values.Customer?.Id) {
        console.log("Customer original:", values.Customer);
        
        // For SharePoint REST API, send lookup field as object with Id property
        values.Customer = { Id: values.Customer.Id };
        console.log("Customer field set to:", values.Customer);
    }

    // Always set OrderStatus to "Confirmed" for new orders
    if (orderItem.isNew()) {
        values.OrderStatus = "Confirmed";
        console.log("OrderStatus set to: Confirmed");
    }

    console.log("Final processed values:", values);

    const isNew = orderItem.isNew();
    const dirtyAttrs = isNew ? undefined : DirtyChecker.dirtyAttributesKeys(orderItem.writableFields, values);
    
    console.log("Order item before setValues:", orderItem);
    
    orderItem.setValues(values);

    const calculatedTotal = orderItem.calculateTotalPrice();
    if (calculatedTotal !== undefined) {
        orderItem.TotalPrice = calculatedTotal;
        console.log("TotalPrice calculated and set:", calculatedTotal);
    }
    
    console.log("Order item after setValues:", orderItem);

    const orderList = new OrdersList();

    try {
        console.log("Saving order item...");
        
        await orderList.saveItem(orderItem, {silent: false, attributes: dirtyAttrs});
        
        console.log("Order item saved successfully");

        if(props.onAfterSave) {
            await props.onAfterSave(orderItem, !isNew);
            pop();
        }
        
    } catch (error) {
        console.error("Error saving order item:", error);
        throw new Error(`Error saving order item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
});

        const handleSave = (): void => {
        if (pending) return;
        if (formRef.current) {
            const errorKeys = Object.keys(formRef.current.errors);
            if (errorKeys.length > 0) {
                const element = document.querySelector(`.${commonClassNames.formikForm} [name='${errorKeys[0]}'],.${commonClassNames.formikForm} #${errorKeys[0]}`);
                if (element && element instanceof HTMLElement) {
                    if (element instanceof HTMLInputElement) {
                        element.focus();
                    }
                    else {
                        // Cast to HTMLElement to access click method
                        (element as HTMLElement).click();
                    }
                }
            }
            else {
                execute();
            }
        }
    };

    const commandBaritems: ICommandBarItemPropsExt[] = [
        {
            key: 'back',
            name: 'Back',
            iconProps: {
                iconName: "Back"
            },
            onClick: () => pop(),
            visible: true,
            iconOnly: true,
            buttonStyles: { root: { borderRight: "1px solid #e0e0e0 !important" } }
        },
        {
            key: 'save',
            iconProps: { iconName: 'Save' },
            onClick: handleSave,
            disabled: !isValid || pending,
            text: strings.Save,
            visible: true,
        },
        {
            key: 'delete',
            iconProps: { iconName: 'Delete' },
            disabled: false,
            text: strings.Delete,
            visible: !orderItem.isNew(),
            onClick: toggleDelete
        }
    ];




    return (<Content>
        <CustomCommandBar items={commandBaritems}  />
        <PageTitle breadrumb={<span>{orderItem.isNew() ? strings.Order.NewOrder : orderItem.Title}</span>}/>
        {pending && <ProgressIndicator styles={progressBarStyles} />}
            {error !== null && <BlockedMessageBar message={error.message} messageBarType={MessageBarType.error} onDismiss={noop} />}

            <ScrollableContent>
                <Section>
                    <OrderForm orderItem={orderItem} formRef={formRef} validityCallback={validityCallback} />
                </Section>
            </ScrollableContent>

            {showDelete && <ConfirmDialog
                    title={`Delete ${orderItem.Title}?`}
                    onCancel={toggleDelete}
                    onAction={handleDelete}
                    subText={`Are you sure you want to delete ${orderItem.Title}? This action cannot be undone.`}
                    />}
    </Content>
    );
}