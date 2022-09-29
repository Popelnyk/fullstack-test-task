type RawRecord = {
  timestamp: number;
  name: string;
  resource: string;
  value: number;
};

type Users = Record<string, number>;
type Resources = Record<string, Users>;

type ProcessedRecord = {
  timestamp: number;
  resources: Resources;
};

type TableRecord = {
  name: string;
  resource: string;
  amount: number;
};

type TableColumn = [
  {
    Header: "User";
    accessor: "name";
  },
  {
    Header: "Resource";
    accessor: "resource";
  },
  {
    Header: "Resource";
    accessor: "amount";
  }
];

type TabelProps = {
  columns: TableColumn;
  data: TableRecord[];
};
