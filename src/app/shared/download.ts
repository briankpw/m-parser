import * as _ from 'underscore';

import { DateTime } from './date';

// convert Json to CSV data
function ConvertToCSV(dataset, column?, heading?) {
  let str: string = '';
  let arrayLabel: Array<string>;
  if (typeof column !== 'undefined') {
    arrayLabel = column;
    str +=
      typeof heading === 'undefined'
        ? arrayLabel.join(',') + '\r\n'
        : heading.join(',') + '\r\n';
  } else {
    arrayLabel = Object.keys(dataset[0]);
    str += arrayLabel.join(',') + '\r\n';
  }

  for (let i = 0; i < dataset.length; i++) {
    let line: string = '';
    for (let j = 0; j < arrayLabel.length; j++) {
      if (line !== '') {
        line += ',';
      }
      const value: any =
        arrayLabel[j].indexOf('(') >= 0
          ? applyFunction(arrayLabel[j], dataset[i])
          : dataset[i][arrayLabel[j]];

      if (_.isString(value)) {
        line += `"${value}"`;
      } else if (value) {
        line += value;
      } else {
        line += 'NULL';
      }
    }
    str += line + '\r\n';
  }

  return str;
}

function applyFunction(label: string, data: any) {
  const functionNameAndParameters: Array<string> = label.split('(');
  const parameters: Array<string> = functionNameAndParameters[1]
    .substring(0, functionNameAndParameters[1].indexOf(')'))
    .split(',');

  switch (functionNameAndParameters[0]) {
    case 'concatColumns': {
      return `${data[parameters[0]]} ${data[parameters[1]]}`;
    }
    // case 'UTCToLocalTime': {
    //   return DateTime.displayDateTime(data[parameters[0]], 'DD MMM YYYY HH:mm:ss');
    // }
  }
}

// Final Code for Download CSV Function
function csvFile(dataset, fileName?, column?, heading?) {
  const csvData = ConvertToCSV(dataset, column, heading);
  const a = document.createElement('a');
  a.setAttribute('style', 'display:none;');
  document.body.appendChild(a);
  const csv = '\ufeff' + csvData;
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  a.href = url;

  if (typeof fileName !== 'undefined') {
    a.download = `${fileName}_${DateTime.currentDate()}.csv`;
  }

  a.click();
}

function csvPureFile(data, fileName?) {
  const a = document.createElement('a');
  a.setAttribute('style', 'display:none;');
  document.body.appendChild(a);
  const blob = new Blob([data], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  a.href = url;

  if (typeof fileName !== 'undefined') {
    a.download = `${fileName}_${DateTime.currentDate()}.csv`;
  }

  a.click();
}

const Download = {
  csvFile,
  csvPureFile,
};

export { Download };
