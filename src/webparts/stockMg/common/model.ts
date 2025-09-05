import { DateTimeProperty, NumberProperty, Property, SPList, SPListItem, LookUpProperty } from "spfx-addon";
import { CurrencyEnum, CustomerTypeEnum, ItemsCategoryEnum, ListsEnum } from "./types";
import * as Yup from 'yup';
import * as strings from "StockMgWebPartStrings";   

//order model
export class OrderItem extends SPListItem{
    @LookUpProperty()  // Use LookUpProperty for lookup fields
    public Item?: any = undefined;  // This will handle the lookup properly

    @LookUpProperty()  // Use LookUpProperty for lookup fields
    public Customer?: any = undefined;  // This will handle the lookup properly

    @NumberProperty()
    public QuantityOrdered?: number = undefined;

    @NumberProperty()
    public UnitPrice?: number = undefined;

    @Property()
    public OrderStatus?: string = undefined;

    @NumberProperty()
    public TotalPrice?: number = undefined;

    @DateTimeProperty()
    public OrderDate?: Date = undefined;

    @Property()
    public Currency?: CurrencyEnum = undefined;

    constructor(){
        super(ListsEnum.Orders);
    }

    validate(info?: any): Record<string, any> {
        return Yup.object().shape({
            Customer: Yup.object().required(strings.RequiredValidationMessage),
            StockItem: Yup.object().required(strings.RequiredValidationMessage),
            QuantityOrdered: Yup.number().required(strings.RequiredValidationMessage).min(1, strings.NegativeNumberValidationMessage),
        })
    }

    public getCustomerId(): number | undefined {
        if (this.Customer) {
            // If it's already an object with Id
            if (typeof this.Customer === 'object' && this.Customer.Id) {
                return this.Customer.Id;
            }
            // If it's in the "ID;#Title" format
            if (typeof this.Customer === 'string' && this.Customer.includes(';#')) {
                return parseInt(this.Customer.split(';#')[0]);
            }
        }
        return undefined;
    }

    public getCustomerTitle(): string | undefined {
        if (this.Customer) {
            // If it's already an object with Title
            if (typeof this.Customer === 'object' && this.Customer.Title) {
                return this.Customer.Title;
            }
            // If it's in the "ID;#Title" format
            if (typeof this.Customer === 'string' && this.Customer.includes(';#')) {
                return this.Customer.split(';#')[1];
            }
        }
        return undefined;
    }

    public getItemId(): number | undefined {
        if (this.Item) {
            // If it's already an object with Id
            if (typeof this.Item === 'object' && this.Item.Id) {
                return this.Item.Id;
            }
            // If it's in the "ID;#Title" format
            if (typeof this.Item === 'string' && this.Item.includes(';#')) {
                return parseInt(this.Item.split(';#')[0]);
            }
        }
        return undefined;
    }

    public getItemTitle(): string | undefined {
        if (this.Item) {
            // If it's already an object with Title
            if (typeof this.Item === 'object' && this.Item.Title) {
                return this.Item.Title;
            }
            // If it's in the "ID;#Title" format
            if (typeof this.Item === 'string' && this.Item.includes(';#')) {
                return this.Item.split(';#')[1];
            }
        }
        return undefined;
    }


    public calculateTotalPrice(): number | undefined {
        if (this.QuantityOrdered && this.UnitPrice) {
            return this.QuantityOrdered * this.UnitPrice;
        }
        return undefined;
    }
}

export class OrdersList extends SPList{
    constructor(){
        super(ListsEnum.Orders);
    }

    createItem(): OrderItem {
        return new OrderItem();
    }
}

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