const meritColumn: String[] = [
  'meritID',
  'userID',
  'prajna',
  'heart',
  'mijima',
  'medicine',
  'createdDate',
];
const userColumn: String[] = [
  'userID',
  'name',
  'email',
  'gender',
  'dateOfBirth',
  'countryID',
  'categoryID',
  'createdDate',
];
const anomalyColumn: String[] = [
  'no',
  'timestamp',
  'email',
  'name',
  'country',
  'prajna',
  'heart',
  'mijima',
  'medicine',
];


const File = {
  meritColumn,
  userColumn,
  anomalyColumn,
};

export { File };
