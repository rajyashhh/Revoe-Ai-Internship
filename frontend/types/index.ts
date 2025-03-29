export interface ColumnDefinition {
  name: string;
  type: 'Text' | 'Date' | 'Number';
}

export interface TableConfig {
  id: number;
  columns: ColumnDefinition[];
  sheetUrl: string;
  tabName: string;
}

export interface SheetRow {
  [key: string]: any;
} 