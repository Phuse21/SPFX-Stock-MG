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
  NotItemsFound: string;
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
  PropertyPane:{
    Description: string;
    BasicGroupName: string;
    FlowUrlFieldLabel: string;
  },
  RequestDocument:{
    Created: string;
    CreatedBy: string;
    Name: string;
  }
}

declare module 'StockMgWebPartStrings' {
  const strings: IStockMgWebPartStrings;
  export = strings;
}
