import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';

import * as _ from 'underscore';
import moment from 'moment';

import { Download } from '../shared/download';

@Component({
  selector: 'app-google',
  templateUrl: './google.component.html',
  styleUrls: ['./google.component.css'],
})
export class GoogleComponent implements OnInit {
  header = true;

  // Raw
  rawRecords: any[] = [];

  // AG Grid
  public gridOptions: GridOptions = {
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

  public columnDefs: Array<any> = [
    {
      headerName: 'Timestamp',
      field: 'timestamp',
      width: '150px',
    },
    { headerName: 'Email', field: 'email', width: '200px' },
    { headerName: 'Name', field: 'name', width: '100px' },
    { headerName: 'Country', field: 'country', width: '100px' },
    { headerName: 'Prajna', field: 'prajna', width: '80px' },
    { headerName: 'Heart', field: 'heart', width: '80px' },
    { headerName: 'Mijima', field: 'mijima', width: '80px' },
    { headerName: 'Note', field: 'note' },
  ];

  public meritColumnDefs: Array<any> = [
    { headerName: 'Merit ID', field: 'meritID', width: '80px' },
    { headerName: 'User ID', field: 'userID', width: '80px' },
    {
      headerName: 'Timestamp',
      field: 'createdDate',
      width: '150px',
    },
    { headerName: 'Email', field: 'email', width: '200px' },
    { headerName: 'Name', field: 'name', width: '100px' },
    { headerName: 'Country', field: 'country', width: '100px' },
    { headerName: 'Prajna', field: 'prajna', width: '80px' },
    { headerName: 'Heart', field: 'heart', width: '80px' },
    { headerName: 'Mijima', field: 'mijima', width: '80px' },
    { headerName: 'Note', field: 'note' },
  ];

  public userColumnDefs: Array<any> = [
    { headerName: 'User ID', field: 'userID', width: '80px' },
    {
      headerName: 'Timestamp',
      field: 'createdDate',
      width: '150px',
    },
    { headerName: 'Email', field: 'email', width: '200px' },
    { headerName: 'Name', field: 'name', width: '100px' },
    { headerName: 'Gender', field: 'gender', width: '80px' },
    { headerName: 'DOB', field: 'dateOfBirth', width: '80px' },
    { headerName: 'Country', field: 'countryID', width: '100px' },
    { headerName: 'Category', field: 'categoryID', width: '80px' },
    { headerName: 'Note', field: 'note' },
  ];

  public anomalyColumnDefs: Array<any> = [
    { headerName: 'No', field: 'no', width: '100px', sort: 'asc' },
    {
      headerName: 'Timestamp',
      field: 'timestamp',
      width: '150px',
    },
    { headerName: 'Email', field: 'email', width: '150px' },
    { headerName: 'Name', field: 'name', width: '100px' },
    { headerName: 'Country', field: 'country', width: '100px' },
    { headerName: 'Prajna', field: 'prajna', width: '80px' },
    { headerName: 'Heart', field: 'heart', width: '80px' },
    { headerName: 'Mijima', field: 'mijima', width: '80px' },
    { headerName: 'Note', field: 'note' },
  ];

  // Process
  public anomalyRow: Array<any> = [];
  public overloadRow: Array<any> = [];
  public meritRow: Array<any> = [];
  public userRow: Array<any> = [];

  // List

  private categoryList: Array<any> = [
    { id: 'INDIVIDUAL', name: '個人', simple: '' },
    { id: 'CLASS', name: '班級', simple: '' },
    { id: 'GROUP', name: '團體', simple: '' },
    { id: 'SANGHA', name: '僧團', simple: '' },
  ];

  // csv
  private meritColumn: String[] = [
    'meritID',
    'userID',
    'prajna',
    'heart',
    'mijima',
    'createdDate',
  ];
  private userColumn: String[] = [
    'userID',
    'name',
    'email',
    'gender',
    'dateOfBirth',
    'countryID',
    'categoryID',
    'createdDate',
  ];
  private anomalyColumn: String[] = [
    'timestamp',
    'email',
    'name',
    'country',
    'prajna',
    'heart',
    'mijima',
    'no',
  ];

  constructor(private ngxCsvParser: NgxCsvParser) {}
  ngOnInit() {}

  fileChangeListener($event: any): void {
    // Select the files from the event
    const files = $event.srcElement.files;

    // Parse the file you want to select for the operation along with the configuration
    console.log(this.ngxCsvParser.isCSVFile(files[0]));
    this.ngxCsvParser
      .parse(files[0], { header: this.header, delimiter: ',' })
      .pipe()
      .subscribe(
        (result: Array<any>) => {
          this.rawRecords = result;
          // this.csvRecordsCSV = this.convertToCSV(result);this.parseData();
          console.log(this.rawRecords);
        },
        (error: NgxCSVParserError) => {
          console.log('Error', error);
        }
      );
  }

  parseClick() {
    this.parseData(this.rawRecords);
  }

  parseData(data) {
    const parsed: any[] = [];
    const anomaly: any[] = [];
    const overload: any[] = [];

    _.each(data, (d, i) => {
      const obj: any = {};
      obj.date = d.date;
      obj.email = this.removeSpecialChar(d.email.toLowerCase());
      obj.name = this.removeSpecialChar(this.capitalize(d.name));
      obj.country = d.country;
      obj.meritID = 'GF' + 'B2' + '_' + (i + 1);
      obj.userID = obj.email + '$' + obj.name;

      d.timestamp = d.timestamp.replace('下午', 'PM').replace('上午', 'AM');
      obj.createdDate = moment(d.timestamp, 'YYYY/MM/DD a hh:mm:ss').format(
        'YYYY/MM/DD HH:mm:ss'
      );

      const prajna = this.parseNumber(d.prajna);
      const heart = this.parseNumber(d.heart);
      const mijima = this.parseNumber(d.mijima);

      let anomalyCount: number = 0;
      let overloadCount: number = 0;
      if (prajna.status) {
        obj.prajna = prajna.value;
      } else {
        anomalyCount++;
      }

      if (heart.status) {
        obj.heart = heart.value;
      } else {
        anomalyCount++;
      }

      if (mijima.status) {
        obj.mijima = mijima.value;
      } else {
        anomalyCount++;
      }

      if (
        d.timestamp == '' ||
        obj.name == '' ||
        obj.userID == '$' ||
        obj.createdDate == 'Invalid date'
      ) {
      } else {
        parsed.push(obj);
      }

      overloadCount =
        this.validateOverload(obj.prajna, 90) +
        this.validateOverload(obj.heart, 1000) +
        this.validateOverload(obj.mijima, 1000);

      const { isNotName, isNotEmail } = this.validateUser(obj.name, obj.email);

      if (isNotName) {
        anomalyCount++;
      }

      if (isNotEmail) {
        anomalyCount++;
      }

      if (anomalyCount) {
        let note = '';
        if (isNotName) {
          note += ' :Name';
        }

        if (isNotEmail) {
          note += ' :Email';
        }

        const anomalyObj = { ...d };
        anomalyObj.no = i + 1;
        anomalyObj.note = anomalyCount + ' Anomaly Found';
        if (note !== '') {
          anomalyObj.note = anomalyObj.note + ', which is' + note;
        }
        anomaly.push(anomalyObj);
        // console.log(d);
      }

      if (overloadCount) {
        const overloadObj = { ...d };
        overloadObj.no = i + 1;
        overloadObj.note = overloadCount + ' Overload Found';
        overload.push(overloadObj);
        // console.log(d);
      }
    });

    // console.log(anomaly);
    this.meritRow = parsed;
    this.anomalyRow = anomaly;
    this.overloadRow = overload;

    this.parseUser(this.meritRow);
  }

  parseUser(data) {
    const user: any = {};
    const userList: any[] = [];

    _.each(data, (d) => {
      const userId = d.email + '$' + d.name;

      if (user[userId]) {
        // console.log(d);
      } else {
        const obj: any = {};
        obj.userID = userId;
        obj.name = d.name;
        obj.email = d.email;
        obj.gender = d?.gender;
        obj.dateOfBirth = d?.dateOfBirth;
        obj.countryID = this.parseCountry(d.country);
        obj.categoryID = 'INDIVIDUAL';
        obj.createdDate = d.createdDate;

        user[userId] = obj;
      }
    });

    // To Array

    _.each(user, (d) => {
      if (d.name == '' || d.name == '$') {
      } else {
        userList.push(d);
      }
    });

    this.userRow = userList;
    console.log(user);
  }

  downloadClick(value, anomaly = false, user = false) {
    console.log(this[value]);

    let column = anomaly ? this.anomalyColumn : this.meritColumn;
    let fileName = 'merit';
    if (user) {
      column = this.userColumn;
      fileName = 'user';
    }

    Download.csvFile(this[value], fileName, column);
  }

  // Utility
  // Number
  parseNumber(value): { value: number; status: boolean } {
    // console.log(value);
    if (value == '' || value == undefined) {
      return { value: 0, status: true };
    }

    if (!this.isNumber(value)) {
      return { value: 0, status: false };
    }

    const parseValue = parseInt(value);

    if (parseValue >= 0) {
      return { value: parseValue, status: true };
    } else {
      return { value: 0, status: false };
    }
  }

  parseCountry(value: string) {
    const countryList: Array<any> = [
      { id: 'SGP', name: '新加坡', simple: '新加坡' },
      { id: 'MYS', name: '馬來西亞', simple: '马来西亚' },
      { id: 'TWN', name: '台灣', simple: '台湾' },
      { id: 'USA', name: '美國', simple: '美国' },
      { id: 'CAN', name: '加拿大', simple: '加拿大' },
      { id: 'BRN', name: '汶萊', simple: '汶莱' },
      { id: 'CHN', name: '中國', simple: '中国' },
      { id: 'HKG', name: '香港', simple: '香港' },
      { id: 'MAC', name: '澳門', simple: '澳门' },
      { id: 'FRA', name: '法國', simple: '法国' },
      { id: 'AUT', name: '奧地利', simple: '奥地利' },
      { id: 'KOR', name: '韓國', simple: '韩国' },
      { id: 'DEU', name: '德國', simple: '德国' },
      { id: 'LUX', name: '盧森堡', simple: '卢森堡' },
      { id: 'PHL', name: '菲律賓', simple: '菲律宾' },
      { id: 'AUS', name: '澳洲', simple: '澳洲' },
      { id: 'IDN', name: '印尼', simple: '印尼' },
      { id: 'GBR', name: '英國', simple: '英国' },
      { id: 'OTHER', name: '其他', simple: '其他' },
    ];

    const name = value.split('/')[0];
    const found = _.findWhere(countryList, { name });
    if (found) {
      return found.id;
    } else {
      const foundSimple = _.findWhere(countryList, { simple: name });
      if (foundSimple) {
        return foundSimple.id;
      } else {
        return 'OTHER';
      }
    }
  }

  validateOverload(value, limit): number {
    if (value > limit) {
      return 1;
    } else {
      return 0;
    }
  }

  validateUser(name, email): { isNotName: boolean; isNotEmail: boolean } {
    const emailRegex = new RegExp(
      "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
    );

    // /[a-zA-Z0-9_'\.\+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-\.]+/;
    // /^[-'a-z\u4e00-\u9eff]{1,20}$/i
    const chiEngRex = /^[-'a-z\u4e00-\u9eff]{1,20}$/i;
    const chiRex = /^[\u4e00-\u9eff]{1,20}$/i;
    const engRex = /^[A-Za-z0-9]/;
    const symbolSpaceRex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    const symbolRex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    let nameFlag = false,
      emailFlag = false;

    if (email == '') {
      emailFlag = true;
    } else if (emailRegex.test(email)) {
      emailFlag = true;
    }

    // Check Chinese Word
    if (symbolRex.test(name)) {
      nameFlag = false;
    } else if (chiRex.test(name)) {
      if (symbolSpaceRex.test(name)) {
        nameFlag = false;
      } else {
        nameFlag = true;
      }
    } else if (engRex.test(name)) {
      nameFlag = true;
    }

    return { isNotName: !nameFlag, isNotEmail: !emailFlag };
  }

  isNumber(value): boolean {
    return /^\d+$/.test(value);
  }

  removeSpecialChar(string) {
    //  return string.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    return string.replace(/\\/g, '');
  }

  capitalize(phrase): boolean {
    return phrase
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
