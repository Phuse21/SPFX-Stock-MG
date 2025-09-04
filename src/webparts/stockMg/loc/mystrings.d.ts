declare interface IStockMgWebPartStrings {
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
  WorkflowTask: {
    Approver: string;
    Comments: string;
    Created: string;
    AssignedTo: string;
    Title: string;
    Status: string;
    Modified: string;
    ApprovalStatus: string;
    Description: string;
    WorkflowInstance: string;
    Timestamp: string;
    Attachments: string;
    Instructions: string;
    NextStage: string;
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
  const strings: ICbgbpaWebPartStrings;
  export = strings;
}
