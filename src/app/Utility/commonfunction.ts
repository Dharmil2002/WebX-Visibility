export class WebxConvert {

    static objectToInt(obj: any, valueifNull: number): number {
      try {
        if (obj != null && obj != "" && obj != undefined) {
          return parseInt(obj);
        } else {
          return valueifNull;
        }
      } catch (err) {
        return valueifNull;
      }
    }
  
    static objectToDecimal(s: any, valueifNull: number): number {
      try {
        if ((s != null) && (s.toString().trim() != '') && (s != undefined)) {
          var t = parseFloat(s);
          return t;
        } else {
          return valueifNull;
        }
      } catch (err) {
        return valueifNull;
      }
    }
  
    static IsStringNullOrEmpty(obj: any): boolean {
      try {
        if (obj != null && obj != '' && obj != undefined && obj.toString().trim() != '') {
          return false;
        } else {
          return true;
        }
      } catch (err) {
        return true;
      }
    }


    static IsObjectNullOrEmpty(obj: any): boolean {
      try {
        if ((obj != undefined) && (obj != null) && (obj.toString().trim() != '')) {
          return false;
        } else {
          return true;
        }
      } catch (err) {
        return true;
      }
    }
  

    static IsObjectUndefined(obj: any): boolean {
      try {
        if (typeof obj === 'undefined') {
          return true;
        } else {
          return false;
        }
      } catch (err) {
        return true;
      }
    }
  
    static objectToString(obj: any, valueifNull: string): string {
      try {
        if (obj != null && obj != "" && obj != undefined) {
          return obj.toString();
        } else {
          return valueifNull;
        }
      } catch (err) {
        return valueifNull;
      }
    }
  
    static objectToJSON(obj: any, valueifNull: any): any {
      try {
        if (obj != null && obj != "" && obj != undefined) {
          var jsonDataParsed = JSON.parse(obj);
          return jsonDataParsed;
        } else {
          return valueifNull;
        }
      } catch (err) {
        return valueifNull;
      }
    }
  
    //Created By Vijay Patel
    //26th November 2014
    static IsObjectUndefinedOrNull(obj: any): boolean {
      try {
        if (typeof obj === 'undefined' || obj == undefined || obj == null) {
          return true;
        } else {
          return false;
        }
      } catch (err) {
        return true;
      }
    }
  }
  
  //round function
 export function roundNumber(num: number, dec: number): string {
    if (isNaN(num)) return "0.00";
  
    const roundedNum = Math.round(num * 10 ** dec) / 10 ** dec;
    const formattedNum = roundedNum.toFixed(dec);
  
    return formattedNum;
  }
  
/*Below the function which split the dropdown option*/
export function getArrayAfterMatch(arr, element) {
    const index = arr.indexOf(element);
    if (index === -1) {
      return [];
    }
    return arr.slice(index + 1);
  }
/* End */