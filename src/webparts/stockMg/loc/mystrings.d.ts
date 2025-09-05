declare interface IStockMgWebPartStrings {
  PropertyPaneDescription: string;
  DescriptionFieldLabel: string;
  BasicGroupName: string;
  NewCustomer: string;
  LoadingText: string;
  WorkingOnIt: string;
  Save: string;
  Cancel: string;
  RequiredValidationMessage: string;
  NegativeNumberValidationMessage: string;
  Filter: string;
  Sort: string;
  Refresh: string;
  Submit: string;
  Clear: string;
  NoItemsFound: string;
  Add: string;
  Update: string;
  Delete: string;
  StartDate: string;
  EndDate: string;
  StartWorkflow: string;
  Print: string;
  PrintPreview: string;
  AddTask:string;
  FileName: string;
  Send: string;
  View: string;
  Stock: {
    Title: string;
    Description: string;
    StockQuantity: string;
    UnitPrice: string;
    ItemCategory: string;
    Currency: string;
    Id: string;
  },
  Customer: {
    Title: string;
    Id: string;
    PhoneNumber: string;
    Created: string;
    CustomerType: string;
    TotalOrders: string;
    Modified: string;
    Description: string;
   
    
  },
  Order: {
    Title: string;
    Id: string;
    Item: string;
    QuantityOrdered: string;
    UnitPrice: string;
    TotalPrice: string;
    OrderDate: string;
    Currency: string;
    OrderStatus: string;
    Customer: string;
    Created: string;
    TotalOrders: string;
    Modified: string;
    Description: string;
     NewOrder: string;
    
  },
  

}

declare module 'StockMgWebPartStrings' {
  const strings: IStockMgWebPartStrings;
  export = strings;
}
