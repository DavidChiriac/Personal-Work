/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable  @typescript-eslint/no-explicit-any */

import _ from 'lodash';

export const _assign = _.assign;
export const _clone = _.clone;
export const _debounce = _.debounce;
export const _difference = _.difference;
export const _differenceBy = _.differenceBy;
export const _flatten = _.flatten;
export const _intersectionBy = _.intersectionBy;
export const _isEmpty = _.isEmpty;
export const _isEqual = _.isEqual;
export const _isNil = _.isNil;
export const _isNumber = _.isNumber;
export const _isString = _.isString;
export const _minBy = _.minBy;
export const _union = _.union;
export const _unionBy = _.unionBy;
export const _uniq = _.uniq;
export const _uniqBy = _.uniqBy;
export const _merge = _.merge;
export const _orderBy = _.orderBy;
export const _cloneDeep = _.cloneDeep;
export const _isArray = _.isArray;
export const _capitalize = _.capitalize;

export const _isNilOrEmpty = (item: any): boolean => {
  if (_isNil(item)) {
    return true;
  }
  if (_isEmpty(item)) {
    return true;
  }
  return false;
};
