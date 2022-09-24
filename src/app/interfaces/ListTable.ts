export interface TableRow {
  id: string | number;
  values: Array<string | undefined>;
}

export interface TableData {
  rowData: Array<TableRow>;
  headersData: Array<string>;
}

export interface TableProps {
  caption?: string;
  tableContent: TableData;
  colorScheme?: string;
}
