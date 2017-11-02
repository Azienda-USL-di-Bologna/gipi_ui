import {OdataContextDefinition} from "./odata-context-definition";
import {isArray} from "rxjs/util/isArray";
import {CustomLoadingFilterParams} from "../custom-loading-filter-params";

export class CustomOdataContextDefinition extends OdataContextDefinition {
  constructor() {
    super();
  }

  public customLoading (loadOption: any) {
    const customLoadingFilterParams: CustomLoadingFilterParams = loadOption.userData["customLoadingFilterParams"]
    // console.log("custom", customLoadingFilterParams);
    // console.log("option", loadOption);
    if (loadOption.filter != null && customLoadingFilterParams != null) {
      const currentFilter = loadOption.filter;
      for (const i in currentFilter) {
        const targetField: string = customLoadingFilterParams.getTargetField();
        let currentField: any;
        let currentValue: any;
        if (isArray(currentFilter[i][0])) {
          currentField = currentFilter[i][0][0];
          currentValue = currentFilter[i][0][2];
        } else {
          currentField = currentFilter[i][0];
          currentValue = currentFilter[i][2];
        }
        if (currentField === targetField) {
          let myFilter: any = customLoadingFilterParams.getFilter();
          myFilter = this.buildFilter(myFilter, targetField, currentValue);
          currentFilter[i] = myFilter;
          break;
        }
      }
    }
  }

  private buildFilter(filter: any, target: string, value: any) {
    let stringFilter = JSON.stringify(filter);
    stringFilter = stringFilter.replace("${target}", target);
    if (typeof(value) === "string") {
      stringFilter = stringFilter.replace(/\${value}/g, value);
      stringFilter = stringFilter.replace(/\${value.tolower}/g, value.toLowerCase());
    } else {
      stringFilter = stringFilter.replace(/"\${value}"/g, value);
      stringFilter = stringFilter.replace(/"\${value.tolower}"/g, value);
    }
    // console.log("stringFilter", stringFilter);
    return JSON.parse(stringFilter);
  }
}
