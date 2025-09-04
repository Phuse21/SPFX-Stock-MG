import * as React from "react";
import { StockItem, StockList } from "../../../common/model";
import { FormikProps } from "formik";
import NavigationStore from "../../layout/navigationStore";
import { BlockedMessageBar, ConfirmDialog, DirtyChecker, PageTitle, useAsync, useBoolean } from "spfx-addon";
import { commonClassNames, progressBarStyles } from "../../../common/style";
import { ICommandBarItemPropsExt } from "../../../common/types";
import * as strings from "StockMgWebPartStrings";
import { Content } from "../../layout/Content";
import { CustomCommandBar } from "../../commandBar/CustomCommandBar";
import { MessageBarType, ProgressIndicator } from "@fluentui/react";
import { Detail, noop } from "./components/Detail";
import { ScrollableContent } from "../../layout/ScrollableContent";
import { Section } from "../../layout/Section";


export interface IStockPageViewProps {
    stockItem: StockItem;
    onAfterSave: (stockItem: StockItem, updating: boolean) =>Promise<void>;
}

export const StockPageView: React.FC<IStockPageViewProps> = (props) => {
    const currentTitle = NavigationStore.useStoreState(state => state.getCurrentTitle);

    const { stockItem } = props;
    const formRef = React.useRef<FormikProps<Record<string, any>> | null>(null);
    const [isValid, setIsValid] = React.useState(false);
    const {pop} = NavigationStore.useStoreActions(actions => actions);
    const [showDelete, { toggle: toggleDelete }] = useBoolean(false);

    const validityCallback = React.useCallback((isValid: boolean) => {
        setIsValid(isValid);
    }, []);

    const handleDelete = async (): Promise<void> => {
        if (!stockItem.isNew()){
            const stockList = new StockList();
            try {
                await stockList.deleteItemById(stockItem.Id!);

                if (props.onAfterSave) {
                await props.onAfterSave(stockItem, false);
            }
                pop();
                
            } catch (error) {
                console.error("Error deleting stock item:", error);
                alert(`Error deleting stock item: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
    }


    const [execute, pending, error] = useAsync(async () => {

        const values = {...formRef.current!.values};
        const isNew = stockItem.isNew();
        const dirtyAttrs = isNew ? undefined : DirtyChecker.dirtyAttributesKeys(stockItem.writableFields, values);
        stockItem.setValues(values);

        const stockList = new StockList();
        try {
            await stockList.saveItem(stockItem, {silent: false, attributes: dirtyAttrs});
            if (props.onAfterSave){
                await props.onAfterSave(stockItem, !isNew);
                pop();
            }
            
        } catch (error) {
            console.error("Error saving stock item:", error);
            throw new Error(`Error saving stock item: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    });


    //function to save the form
   const handleSave = (): void => {
    if (pending) return;
    if (formRef.current){
        const errorKeys = Object.keys(formRef.current.errors);
        if (errorKeys.length > 0){
            const element = document.querySelector(`.${commonClassNames.formikForm} [name='${errorKeys[0]}'], .${commonClassNames.formikForm} #${errorKeys[0]}`); 
            if (element && element instanceof HTMLElement){
                if (element instanceof HTMLInputElement) {
                    element.focus();
                } else {
                    (element as HTMLElement).click();
                }
            }
        } else { 
            execute();
        }
    }
}

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
            visible: !stockItem.isNew(),
            onClick: toggleDelete
        }
    ];

    return (
        <Content>
            <CustomCommandBar items={commandBaritems} />
            <PageTitle 
                  breadrumb={<span style={{ fontSize: "1.25rem", fontWeight: 600 }}>{currentTitle}</span>} 
                 />

                 {pending && <ProgressIndicator styles={progressBarStyles} />}
                 {error && <BlockedMessageBar message={error.message} messageBarType={MessageBarType.error} onDismiss={noop} />}

                 <ScrollableContent>
                    <Section>
                        <Detail stockItem={stockItem} validityCallback={validityCallback} formRef={formRef} readonly={false}/>
                    </Section>
                 </ScrollableContent>

                 {showDelete && <ConfirmDialog onCancel={toggleDelete} onAction={handleDelete} title={`Delete ${stockItem.Title}`} subText="Are you sure you want to delete this item?"/>}
        </Content>
    )
}