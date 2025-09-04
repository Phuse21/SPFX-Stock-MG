import { FormikProps } from "formik";
import { CustomerItem, CustomersList } from "../../../common/model";
import * as React from 'react';
import { BlockedMessageBar, ConfirmDialog, DirtyChecker, PageTitle, useAsync, useBoolean } from "spfx-addon";
import NavigationStore from "../../layout/navigationStore";
import { commonClassNames, progressBarStyles } from "../../../common/style";
import { ICommandBarItemPropsExt } from "../../../common/types";
import * as strings from "StockMgWebPartStrings";
import { Content } from "../../layout/Content";
import { CustomCommandBar } from "../../commandBar/CustomCommandBar";
import { MessageBarType, ProgressIndicator } from "@fluentui/react";
import { noop } from "../stock/components/Detail";
import { ScrollableContent } from "../../layout/ScrollableContent";
import { Section } from "../../layout/Section";
import { CustomerForm } from "./components/CustomerForm";


export interface ICustomerPageViewProps {
    customerItem: CustomerItem
    onAfterSave: (customerItem: CustomerItem, updating: boolean) => Promise<void>

}

export const CustomerPageView: React.FC<ICustomerPageViewProps> = (props) => {

const {customerItem} = props;
const formRef = React.useRef<FormikProps<Record<string, any>>>(null);
const [showDelete, {toggle: toggleDelete}] = useBoolean(false);
const [isValid, setIsValid] = React.useState(false);
const {pop} = NavigationStore.useStoreActions(actions => actions);

const validityCallback = React.useCallback((isValid: boolean) => {
    setIsValid(isValid);
}, []);

const handleDelete = async (): Promise<void> => {
    if (!customerItem.isNew()){
        const customersList = new CustomersList();
        try {
            await customersList.deleteItemById(customerItem.Id!);

            if (props.onAfterSave) {
                await props.onAfterSave(customerItem, false);                
            }
            pop();
            
        } catch (error) {
            console.error("Error deleting customer item:", error);
            alert(`Error deleting customer item: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

    }
}

const [execute, pending, error] = useAsync(async () => {
    const values = {...formRef.current!.values};
    const isNew = customerItem.isNew();
    const dirtyAttrs = isNew ? undefined : DirtyChecker.dirtyAttributesKeys(customerItem.writableFields, values);
    customerItem.setValues(values);

    const customersList = new CustomersList();

    try {
        await customersList.saveItem(customerItem, {silent: false, attributes: dirtyAttrs});
        if (props.onAfterSave){
            await props.onAfterSave(customerItem, !isNew);
            pop();
        }
    } catch (error) {
        console.error("Error saving customer item:", error);
        throw new Error(`Error saving customer item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
});


//function to save form

const handleSave = (): void => {
    if (pending) return;
    if (formRef.current){
        const errorFields = Object.keys(formRef.current.errors);
        if (errorFields.length > 0){
            const element = document.querySelector(`.${commonClassNames.formikForm} [name='${errorFields[0]}'], .${commonClassNames.formikForm} #${errorFields[0]}`);
            if (element && element instanceof HTMLElement){
                element.focus();
            } else {
                (element as HTMLElement).click();
            }
        } else {
            execute();
        }
    }
}

const commandBarItems: ICommandBarItemPropsExt[] = [
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
            disabled: !isValid || pending,
            text: strings.Save,
            visible: true,
            onClick: handleSave
        },
        {
            key: 'delete',
            iconProps: { iconName: 'Delete' },
            disabled: false,
            text: strings.Delete,
            visible: !customerItem.isNew(),
            onClick: toggleDelete
        }
]

    return (<Content>
        <CustomCommandBar items={commandBarItems} />
        <PageTitle breadrumb={<span style={{fontSize: "1.25rem", fontWeight: "600"}}>{customerItem.isNew() ? strings.NewCustomer : customerItem.Title}</span>} />
        {pending && <ProgressIndicator styles={progressBarStyles} />}
        {error && <BlockedMessageBar message={error.message} messageBarType={MessageBarType.error} onDismiss={noop} />}

        <ScrollableContent>
            <Section>
                <CustomerForm customerItem={customerItem} formRef={formRef} validityCallback={validityCallback} />
            </Section>
        </ScrollableContent>

        {showDelete && <ConfirmDialog
        title={`Delete ${customerItem.Title}?`}
        onCancel={toggleDelete}
        onAction={handleDelete}
        subText={`Are you sure you want to delete ${customerItem.Title}? This action cannot be undone.`}
        />}

    </Content>);

}