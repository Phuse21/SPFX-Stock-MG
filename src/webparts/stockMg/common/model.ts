import { NumberProperty, Property, SPList, SPListItem } from "spfx-addon";
import { CurrencyEnum, CustomerTypeEnum, ItemsCategoryEnum, ListsEnum } from "./types";
import * as Yup from 'yup';
import * as strings from "StockMgWebPartStrings";   


//customer model
export class CustomerItem extends SPListItem{
    @Property()
    public PhoneNumber?: string = undefined;
    @NumberProperty()
    public TotalOrders?: number = undefined;
    
    @Property()
    public CustomerType?: CustomerTypeEnum = undefined;

    constructor(){
        super(ListsEnum.Customers);
    }

    validate(info?: any): Record<string, any> {
        return Yup.object().shape({
            Title: Yup.string().required(strings.RequiredValidationMessage),
            PhoneNumber: Yup.string().required(strings.RequiredValidationMessage),
            CustomerType: Yup.mixed<CustomerTypeEnum>().oneOf(Object.values(CustomerTypeEnum), "Invalid Customer Type").required(strings.RequiredValidationMessage),
        })

        
    }

}


export class CustomersList extends SPList{

    constructor(){
        super(ListsEnum.Customers);
    }

    createItem(): CustomerItem {
        return new CustomerItem();
    }
}




//stock model
export class StockItem extends SPListItem {
    @NumberProperty()
    public StockQuantity?: number = undefined;

    @NumberProperty()
   public UnitPrice?: number = undefined;

    @Property()
    public ItemCategory?: ItemsCategoryEnum = undefined;

    @Property()
    public Currency?: CurrencyEnum = undefined;

    constructor() {
        super(ListsEnum.Stock);
    }

    validate(info?: any): Record<string, any> {
        return Yup.object().shape({
            Title: Yup.string().required(strings.RequiredValidationMessage),
            StockQuantity: Yup.number().required(strings.RequiredValidationMessage).min(0, strings.NegativeNumberValidationMessage),
            UnitPrice: Yup.number().required(strings.RequiredValidationMessage).min(0, strings.NegativeNumberValidationMessage),
            ItemCategory: Yup.mixed<ItemsCategoryEnum>().oneOf(Object.values(ItemsCategoryEnum), "Invalid Category").required(strings.RequiredValidationMessage),
            Currency: Yup.mixed<CurrencyEnum>().oneOf(Object.values(CurrencyEnum), "Invalid Currency").required(strings.RequiredValidationMessage),
        })
    }
}

export class StockList extends SPList{
    constructor(){
        super(ListsEnum.Stock);
    }

    createItem(): StockItem {
        return new StockItem();
    }
}