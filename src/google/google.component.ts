import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';

import * as _ from 'underscore';
import moment from 'moment';

import { Download } from '/~/src/shared/download';

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
  };

  public columnDefs: Array<any> = [
    { headerName: 'Date', field: 'date', width: '80px' },
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

  public anomalyColumnDefs: Array<any> = [
    { headerName: 'No', field: 'no', width: '100px', sort: 'asc' },
    { headerName: 'Date', field: 'date', width: '80px' },
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
  public parseRow: Array<any> = [];

  // csv
  private csvColumn: String[] = [
    'timestamp',
    'email',
    'name',
    'country',
    'prajna',
    'heart',
    'mijima',
  ];
  private anomalyColumn: String[] = this.csvColumn.concat(['no']);

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
      obj.email = d.email;
      obj.name = d.name;
      obj.country = d.country;

      d.timestamp = d.timestamp.replace('下午', 'PM').replace('上午', 'AM');
      obj.timestamp = moment(d.timestamp, 'YYYY/MM/DD a hh:mm:ss').format(
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

      if (d.timestamp !== '') {
        parsed.push(obj);
      }

      overloadCount =
        this.validateOverload(obj.prajna, 90) +
        this.validateOverload(obj.heart, 1000) +
        this.validateOverload(obj.mijima, 1000);

      if (anomalyCount) {
        const anomalyObj = { ...d };
        anomalyObj.no = i + 1;
        anomalyObj.note = anomalyCount + ' Anomaly Found';
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
    this.parseRow = parsed;
    this.anomalyRow = anomaly;
    this.overloadRow = overload;
  }

  downloadClick(value, anomaly = false) {
    console.log(this[value]);

    const column = anomaly ? this.anomalyColumn : this.csvColumn;
    Download.csvFile(this[value], 'mParser', column);
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

  validateOverload(value, limit): number {
    if (value > limit) {
      return 1;
    } else {
      return 0;
    }
  }

  isNumber(value): boolean {
    return /^\d+$/.test(value);
  }
}
