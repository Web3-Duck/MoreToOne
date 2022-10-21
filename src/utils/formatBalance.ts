import BigNumber from 'bignumber.js';

export function parseAmount(amount: string, decimal = 18) {
  if (!amount) return '0';

  amount = cleanupAmount(amount);

  const split = amount.split('.');
  const wholePart = split[0];
  const fracPart = split[1] || '';
  if (split.length > 2 || fracPart.length > decimal) {
    throw new Error(`Cannot parse '${amount}' as bignumber`);
  }
  return trimLeadingZeroes(wholePart + fracPart.padEnd(decimal, '0'));
}
export function formatAmount(amount: string, decimal = 18) {
  if (!amount) return '0';

  const amountBN = new BigNumber(amount, 10);
  amount = amountBN.toString(10);
  const wholeStr = amount.substring(0, amount.length - decimal) || '0';
  const fractionStr = amount
    .substring(amount.length - decimal)
    .padStart(decimal, '0')
    .substring(0, decimal);

  return trimTrailingZeroes(`${wholeStr}.${fractionStr}`);
}

export function cleanupAmount(amount) {
  return amount.replace(/,/g, '').trim();
}

export function trimTrailingZeroes(value) {
  return value.replace(/\.?0*$/, '');
}

export function trimLeadingZeroes(value) {
  value = value.replace(/^0+/, '');
  if (value === '') {
    return '0';
  }
  return value;
}

export function formatWithCommas(value) {
  const pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(value)) {
    value = value.replace(pattern, '$1,$2');
  }
  return value;
}

export function toFixed(number, pp) {
  let num = isNaN(number) || !number ? 0 : number;
  const p = isNaN(pp) || !pp ? 0 : pp;
  num = getFullNum(num);
  const n = (num + '').split('.');
  let x = n.length > 1 ? n[1] : '';
  if (x.length > p) {
    x = x.substr(0, p);
  } else {
    x += Array(p - x.length + 1).join('0');
  }
  return n[0] + (x == '' ? '' : '.' + x);
}
export function accMul(arg1, arg2) {
  if (!arg1 || !arg2) {
    return '0';
  }
  const num = new BigNumber(arg1).times(new BigNumber(arg2));
  return num.toString();
}

export function getFullNum(num) {
  // 处理非数字
  if (isNaN(num)) {
    return num;
  }
  const str = String(num);
  if (!/e/i.test(str)) {
    return num;
  }
  return Number(num)
    .toFixed(18)
    .replace(/\.?0+$/, '');
}

export function accDiv(arg1: string, arg2: string) {
  if (!arg1 || !arg2) {
    return 0;
  }
  const num = new BigNumber(arg1).div(new BigNumber(arg2));
  return num.toFixed();
}

export function accAdd(arg1: string, arg2: string) {
  const num = new BigNumber(arg1).plus(new BigNumber(arg2));
  return num.toFixed();
}
export function accSub(arg1: string | number, arg2: string | number) {
  const num = new BigNumber(arg1).minus(new BigNumber(arg2));
  return num.toFixed();
}

// 大于等于
export function accGte(arg1: string, arg2: string) {
  return new BigNumber(arg1).gte(new BigNumber(arg2));
}

// 大于
export function accGt(arg1: string, arg2: string) {
  return new BigNumber(arg1).gt(new BigNumber(arg2));
}

export function gasProcessing(arg1) {
  return toFixed(accMul(new BigNumber(arg1), 1.1), 0);
}

// export function toPrecision(arg1) {
//   let num = new BigNumber(arg1);
//   if (accGte(num, 1000)) {
//     return toFixed(num, 0);
//   }

//   num = num.toPrecision(4);
//   if (num.includes('e')) {
//     const [num1, uint] = num.split('e');
//     const newUint = Number(uint);
//     num = accMul(new BigNumber(num1).toString(10), new BigNumber(10).pow(newUint).toString(10));
//   }
//   return num;
// }
