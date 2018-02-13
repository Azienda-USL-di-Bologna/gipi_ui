import { forEach } from "@angular/router/src/utils/collection";

export class UtilityFunctions{

  isDataBiggerOrEqual(data1: Date, data2: Date): boolean {
    
    if (data1 == null || data2 == null)
      return false;

    if (data1.getFullYear() > data2.getFullYear())
      return true;
    else if (data1.getFullYear() < data2.getFullYear())
      return false;
    else {
      if (data1.getMonth() > data2.getMonth())
        return true;
      else if (data1.getMonth() < data2.getMonth())
        return false;
      else {
        if (data1.getDate() >= data2.getDate())
          return true;
        else
          return false;
      }
    }
  }

  public buildMultipleFilterForArray(field: string, values: any): any {
    let array: any = [];

    array.push([field, "=", values.pop()]);

    values.forEach(function(e) {
      array.push("or");
      array.push([field, "=", e]);
    });

    return array;
  }
}