import * as React from 'react';
import { Formik, FormikProps } from 'formik';
import { Stack } from '@fluentui/react/lib/Stack';
import { FieldChoiceColumnDropdown, FieldNumber, FieldText } from 'spfx-addon/lib/components/formikInputs';
import { StockItem } from '../../../../common/model';
import { commonClassNames, stylesCardWidthPadding } from '../../../../common/style';
import * as strings from 'StockMgWebPartStrings';
import {  ListsEnum } from '../../../../common/types';

const gap = { childrenGap: 5 }

export const noop = (): void => { }

export interface IDetailProps {
    stockItem: StockItem;
    // eslint-disable-next-line @rushstack/no-new-null
    formRef?: React.MutableRefObject<FormikProps<Record<string, any>> | null>;
    validityCallback?: (isValid: boolean) => void;
    readonly?: boolean;
}

export const Detail: React.FC<IDetailProps> = (props) => {
    const { stockItem, formRef, validityCallback = noop, readonly } = props;
    return (
        <Formik
            validateOnMount={true}
            initialValues={stockItem.writableFields}
            enableReinitialize={true}
            validationSchema={stockItem.validate()}
            innerRef={formRef}
            onSubmit={noop}>
            {({ isValid, values }: FormikProps<{}>) => {
                validityCallback(isValid);
                return (<Stack styles={stylesCardWidthPadding}>
                    <div className={commonClassNames.formikForm}>
                        <Stack tokens={gap} style={{ minWidth: "50%", maxWidth: 350 }}>
                            <Stack.Item>
                                <FieldText
                                    name='Title'
                                    label={strings.Stock.Title}
                                    disabled={readonly}
                                    required />
                            </Stack.Item>
                            <Stack.Item>
                                <FieldNumber
                                    name='StockQuantity'
                                    label={strings.Stock.StockQuantity}
                                    disabled={readonly}
                                    required />
                            </Stack.Item>
                            <Stack.Item>
                                <FieldNumber
                                    name='UnitPrice'
                                    label={strings.Stock.UnitPrice}
                                    disabled={readonly}
                                    required />
                            </Stack.Item>
                            <Stack.Item>
                                <FieldChoiceColumnDropdown
                                    name='ItemCategory'
                                    label={strings.Stock.ItemCategory}
                                    listName={ListsEnum.Stock}
                                    disabled={readonly}
                                    required />
                            </Stack.Item>
                            <Stack.Item>
                                <FieldChoiceColumnDropdown
                                    name='Currency'
                                    label={strings.Stock.Currency}
                                    listName={ListsEnum.Stock}
                                    disabled={readonly}
                                    required />
                            </Stack.Item>
                            
                            
                        </Stack>
                    </div>
                </Stack>)
            }}
        </Formik>
    );
}