import * as React from 'react';
import { Formik, FormikProps } from 'formik';
import { CustomerItem } from '../../../../common/model';
import { Stack } from '@fluentui/react';
import { commonClassNames, stylesCardWidthPadding } from '../../../../common/style';
import { FieldChoiceColumnDropdown, FieldText } from 'spfx-addon';
import * as strings from 'StockMgWebPartStrings';
import { ListsEnum } from '../../../../common/types';
import { noop } from '../../stock/components/Detail';


const gap = { childrenGap: 5 }


export interface ICustomerFormProps {
    customerItem: CustomerItem;
    // eslint-disable-next-line @rushstack/no-new-null
    formRef?: React.MutableRefObject<FormikProps<Record<string, any>> | null>;
    validityCallback?: (isValid: boolean) => void;
    readonly?: boolean;
}

export const CustomerForm: React.FC<ICustomerFormProps> = (props) => {
    const { customerItem, formRef, validityCallback = noop, readonly } = props;
    return (
        <Formik
            validateOnMount={true}
            initialValues={customerItem.writableFields}
            enableReinitialize={true}
            validationSchema={customerItem.validate()}
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
                                    label={strings.Customer.Title}
                                    disabled={readonly}
                                    required />
                            </Stack.Item>
                            <Stack.Item>
                                <FieldText
                                    name='PhoneNumber'
                                    label={strings.Customer.PhoneNumber}
                                    disabled={readonly}
                                    required />
                            </Stack.Item>
                            
                           
                            <Stack.Item>
                                <FieldChoiceColumnDropdown
                                    name='CustomerType'
                                    label={strings.Customer.CustomerType}
                                    listName={ListsEnum.Customers}
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