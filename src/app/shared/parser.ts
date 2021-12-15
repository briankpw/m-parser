import * as _ from 'underscore';

const countryDataset: Array<any> = [
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

// Parser
function parseCountry(name: string) {
  const countryList = countryDataset;

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

// Validation
function validateOverload(value, limit): number {
  if (value > limit) {
    return 1;
  } else {
    return 0;
  }
}

function validateUser(
  name,
  email
): { isNotName: boolean; isNotEmail: boolean } {
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

function validateCountry(country): boolean {
  const countryList = countryDataset;
  const name = country.split('/');

  if (name.length > 1) {
    return false;
  }

  const found = _.findWhere(countryList, { name: country });
  if (found) {
    return true;
  } else {
    const foundSimple = _.findWhere(countryList, { simple: country });
    if (foundSimple) {
      return true;
    } else {
      return false;
    }
  }
}

// Util
function isNumber(value): boolean {
  return /^\d+$/.test(value);
}

function removeSpecialChar(string) {
  //  return string.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
  return string.replace(/\\/g, '');
}

function capitalize(phrase): boolean {
  return phrase
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const Parser = {
  parseCountry,
  validateOverload,
  validateUser,
  validateCountry,
  isNumber,
  removeSpecialChar,
  capitalize,
};

export { Parser };
