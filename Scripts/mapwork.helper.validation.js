export class ValidationHelper {
  static validateInput(obj, options) {
    'use strict';
    obj = $(obj);
    var errors, optionCount;
    errors = [];

    for (optionCount = 0; optionCount < options.length; optionCount++) {
      if (options[optionCount].kind === 'required') {
        if (obj.val() === '') {
          errors.push('required');
        }
      } else if (options[optionCount].kind === 'isnumeric') {
        if (!$.isNumeric(obj.val())) {
          errors.push('isnumeric');
        }
      } else if (options[optionCount].kind === 'istext') {
        if (
          $.isNumeric(obj.val()) ||
          $.isFunction(obj.val()) ||
          $.isArray(obj.val()) ||
          $.isEmptyObject(obj.val())
        ) {
          errors.push('istext');
        }
      } else if (options[optionCount].kind === 'min') {
        if (parseInt(obj.val(), 10) < options[optionCount].value) {
          errors.push('min');
        }
      } else if (options[optionCount].kind === 'max') {
        if (parseInt(obj.val(), 10) > options[optionCount].value) {
          errors.push('max');
        }
      }
    }

    return errors;
  }
}
