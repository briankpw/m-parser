const gridOptions = {
  pagination: true,
  paginationPageSize: 200,
  headerHeight: 38,
  rowSelection: 'single',
  defaultColDef: {
    sortable: true,
    resizable: true,
    filter: true,
  },
  enableCellTextSelection: true,
};

const columnDefs: Array<any> = [
  {
    headerName: 'Timestamp',
    field: 'timestamp',
    width: '180px',
  },
  { headerName: 'Email', field: 'email', width: '200px' },
  { headerName: 'Name', field: 'name', width: '100px' },
  { headerName: 'Country', field: 'country', width: '100px' },
  { headerName: 'Prajna', field: 'prajna', width: '80px' },
  { headerName: 'Heart', field: 'heart', width: '80px' },
  { headerName: 'Mijima', field: 'mijima', width: '80px' },
  { headerName: 'Medicine', field: 'medicine', width: '80px' },
  { headerName: 'Note', field: 'note' },
];

const meritColumnDefs: Array<any> = [
  { headerName: 'Merit ID', field: 'meritID', width: '80px' },
  { headerName: 'User ID', field: 'userID', width: '80px' },
  {
    headerName: 'Timestamp',
    field: 'createdDate',
    width: '180px',
  },
  { headerName: 'Email', field: 'email', width: '200px' },
  { headerName: 'Name', field: 'name', width: '100px' },
  { headerName: 'Country', field: 'country', width: '100px' },
  { headerName: 'Prajna', field: 'prajna', width: '80px' },
  { headerName: 'Heart', field: 'heart', width: '80px' },
  { headerName: 'Mijima', field: 'mijima', width: '80px' },
  { headerName: 'Medicine', field: 'medicine', width: '80px' },
  { headerName: 'Note', field: 'note' },
];

const userColumnDefs: Array<any> = [
  { headerName: 'User ID', field: 'userID', width: '80px' },
  {
    headerName: 'Timestamp',
    field: 'createdDate',
    width: '180px',
  },
  { headerName: 'Email', field: 'email', width: '200px' },
  { headerName: 'Name', field: 'name', width: '100px' },
  { headerName: 'Gender', field: 'gender', width: '80px' },
  { headerName: 'DOB', field: 'dateOfBirth', width: '80px' },
  { headerName: 'Country', field: 'countryID', width: '100px' },
  { headerName: 'Category', field: 'categoryID', width: '80px' },
  { headerName: 'Note', field: 'note', width: '300px' },
];

const anomalyColumnDefs: Array<any> = [
  { headerName: 'ID', field: 'id', width: '100px', sort: 'asc' },
  {
    headerName: 'Timestamp',
    field: 'timestamp',
    width: '150px',
  },
  { headerName: 'Name', field: 'name', width: '100px' },
  { headerName: 'Country', field: 'country', width: '100px' },
  { headerName: 'Prajna', field: 'prajna', width: '80px' },
  { headerName: 'Heart', field: 'heart', width: '80px' },
  { headerName: 'Mijima', field: 'mijima', width: '80px' },
  { headerName: 'Medicine', field: 'medicine', width: '80px' },
  { headerName: 'Note', field: 'note' },
];

const Aggrid = {gridOptions,
  columnDefs,
  meritColumnDefs,
  userColumnDefs,
  anomalyColumnDefs,
};

export { Aggrid };
