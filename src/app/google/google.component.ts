import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';

import * as _ from 'underscore';
import moment from 'moment';

import { Download } from '../shared/download';
import { Parser } from '../shared/parser';
import { Aggrid } from '../shared/aggrid';
import { File } from '../shared/file';

@Component({
  selector: 'app-google',
  templateUrl: './google.component.html',
  styleUrls: ['./google.component.css'],
})
export class GoogleComponent implements OnInit {
  header = true;

  // Raw
  rawRecords: any[] = [];
  globalMinDate: any;
  globalMaxDate: any;
  globalDateRange: string = '';

  // AG Grid
  public gridOptions: GridOptions = Aggrid.gridOptions;
  public columnDefs: Array<any> = Aggrid.columnDefs;
  public meritColumnDefs: Array<any> = Aggrid.meritColumnDefs;
  public userColumnDefs: Array<any> = Aggrid.userColumnDefs;
  public anomalyColumnDefs: Array<any> = Aggrid.anomalyColumnDefs;

  // Process
  public anomalyRow: Array<any> = [];
  public overloadRow: Array<any> = [];
  public multipleRow: Array<any> = [];
  public meritRow: Array<any> = [];
  public userRow: Array<any> = [];

  // List
  private categoryList: Array<any> = [
    { id: 'INDIVIDUAL', name: '個人', simple: '' },
    { id: 'CLASS', name: '班級', simple: '' },
    { id: 'GROUP', name: '團體', simple: '' },
    { id: 'SANGHA', name: '僧團', simple: '' },
  ];

  private metadata: Array<any> = [];

  // csv
  private meritColumn: String[] = File.meritColumn;
  private userColumn: String[] = File.userColumn;
  private anomalyColumn: String[] = File.anomalyColumn;

  constructor(private ngxCsvParser: NgxCsvParser) {}
  ngOnInit() {}

  fileChangeListener($event: any): void {
    // Select the files from the event
    const files = $event.srcElement.files;

    // Parse the file you want to select for the operation along with the configuration
    // console.log(this.ngxCsvParser.isCSVFile(files[0]));
    this.ngxCsvParser
      .parse(files[0], { header: this.header, delimiter: ',' })
      .pipe()
      .subscribe(
        (result: Array<any>) => {
          this.rawRecords = result;
          this.parseMetaData(result);
          // this.csvRecordsCSV = this.convertToCSV(result);this.parseData();
          // console.log(this.rawRecords);
        },
        (error: NgxCSVParserError) => {
          console.log('Error', error);
        }
      );
  }

  parseDateQuick(data) {
    if (data.length == 0) {
      return;
    }

    this.globalMinDate = moment(
      data[0].timestamp,
      'YYYY/MM/DD a hh:mm:ss'
    ).format('YYYY/MM/DD');

    this.globalMaxDate = moment(
      data.length - 1,
      'YYYY/MM/DD a hh:mm:ss'
    ).format('YYYY/MM/DD');

    this.globalDateRange = this.globalMinDate + ' To ' + this.globalMaxDate;
  }

  parseMetaData(data) {
    let dataset = _.chain(data)
      .pluck('timestamp')
      .map((d) => {
        return moment(d, 'YYYY/MM/DD a hh:mm:ss').format('YYYY/MM/DD');
      })
      .uniq()
      .map((d) => {
        return new Date(d);
      })
      .value();

    this.globalMinDate = new Date(Math.min.apply(null, dataset));
    this.globalMaxDate = new Date(Math.max.apply(null, dataset));

    this.globalDateRange =
      moment(this.globalMinDate).format('YYYY/MM/DD') +
      ' To ' +
      moment(this.globalMaxDate).format('YYYY/MM/DD');
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
      obj.email = Parser.removeSpecialChar(d.email.toLowerCase());
      obj.name = Parser.removeSpecialChar(Parser.capitalize(d.name));
      obj.country = d.country;
      obj.meritID = 'GF' + 'B1' + '_' + (i + 1);
      obj.userID = obj.email + '$' + obj.name;

      d.timestamp = d.timestamp.replace('下午', 'PM').replace('上午', 'AM');

      const momentDate = moment(d.timestamp, 'YYYY/MM/DD a hh:mm:ss');
      obj.createdDate = momentDate.format('YYYY/MM/DD HH:mm:ss');
      obj.date = momentDate.format('YYYY/MM/DD');
      obj.week = momentDate.week();

      const prajna = this.parseNumber(d.prajna);
      const heart = this.parseNumber(d.heart);
      const mijima = this.parseNumber(d.mijima);
      const medicine = this.parseNumber(d.medicine);

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

      if (medicine.status) {
        obj.medicine = medicine.value;
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
        Parser.validateOverload(obj.prajna, 90) +
        Parser.validateOverload(obj.heart, 1000) +
        Parser.validateOverload(obj.mijima, 1000) +
        Parser.validateOverload(obj.medicine, 90);

      const { isNotName, isNotEmail } = Parser.validateUser(
        obj.name,
        obj.email
      );

      if (isNotName) {
        anomalyCount++;
      }

      if (isNotEmail) {
        anomalyCount++;
      }

      if (!Parser.validateCountry(obj.country)) {
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

        if (!Parser.validateCountry(obj.country)) {
          note += ' :Location';
        }

        const anomalyObj = { ...d };
        anomalyObj.id = i + 1;
        anomalyObj.note = anomalyCount + ' Anomaly Found';
        if (note !== '') {
          anomalyObj.note = anomalyObj.note + ', which is' + note;
        }
        anomaly.push(anomalyObj);
      }

      if (overloadCount) {
        const overloadObj = { ...d };
        overloadObj.id = i + 1;
        overloadObj.note = overloadCount + ' Overload Found';
        overload.push(overloadObj);
      }
    });

    this.meritRow = parsed;
    this.anomalyRow = anomaly;
    this.overloadRow = overload;

    // console.log(this.meritRow);
    this.parseUser(this.meritRow);
    this.parseMultipleEntry(this.meritRow);
  }

  parseMultipleEntry(data) {
    const multiple = {};
    const multipleList: any[] = [];

    const groupDate = _.groupBy(data, function (value) {
      return value.week + '#' + value.email + '$' + value.name;
    });

    _.each(groupDate, function (d, i) {
      if (d.length > 5) {
        _.each(d, function (dd) {
          if (multiple.hasOwnProperty(i)) {
            multiple[i].prajna += dd.prajna;
            multiple[i].heart += dd.heart;
            multiple[i].mijima += dd.mijima;
            multiple[i].medicine += dd.medicine;
          } else {
            // First Times
            multiple[i] = dd;
            multiple[i].note = d.length + ' Entry Found';
            multiple[i].id = _.pluck(d, 'meritID');
            multiple[i].timestamp = _.chain(d).pluck('date').uniq().value();
          }
        });
      }
    });

    // To Array & Overload Check
    _.each(multiple, (d) => {
      let big = false;
      let note = '';

      // Big Volume
      if (Parser.validateOverload(d.prajna, 90)) {
        big = true;
        note += ' :Prajna';
      } else if (Parser.validateOverload(d.heart, 100)) {
        big = true;
        note += ' :Heart';
      } else if (Parser.validateOverload(d.mijima, 50)) {
        big = true;
        note += ' :Mijima';
      } else if (Parser.validateOverload(d.medicine, 50)) {
        big = true;
        note += ' :Medicine';
      }

      if (big) {
        d.note += note;
        multipleList.push(d);
      }
    });

    this.multipleRow = multipleList;
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

    if (!Parser.isNumber(value)) {
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
    const name = value.split('/')[0];
    return Parser.parseCountry(name);
  }
}
