export interface IFieldDefinition {      
    
    getColumn(columnName: string): any | undefined;    
    getColumnDetails(columnName: string, field: string): any | undefined;
    getColumnTitle(columnName: string): string | undefined ;
    getColumnClass(columnName: string): string | undefined;    
    getColumnStyle(columnName: string): string | undefined ;
}
  