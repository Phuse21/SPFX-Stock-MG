import { ICommandBarItemProps } from "@fluentui/react";


export enum ListsEnum {
    Stock = "Stock",
    Customers = "Customers",
    Orders = "Orders",
}

export enum ItemsCategoryEnum {
    Electronics = "Electronics",
    Grocery = "Grocery",
    Clothing = "Clothing",
    Other = "Other",
}
export enum OrderStatusEnum {
    Confirmed = "Confirmed",
    Delivered = "Delivered",
    Cancelled = "Cancelled",
}


export enum CurrencyEnum {
    USD = "USD",
    EUR = "EUR",
    GBP = "GBP",
    GHC = "GHC"
}

export interface ICommandBarItemPropsExt extends ICommandBarItemProps {
    visible: boolean;
}
