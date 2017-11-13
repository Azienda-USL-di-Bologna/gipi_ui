import {ContextModuleConfig, ServerObjectsDescriptor} from "./context-module-config";
import ODataContext from "devextreme/data/odata/context";
import {keyConverters, EdmLiteral} from "devextreme/data/odata/utils";
import * as moment from "moment";
import * as config from "devextreme/core/config";
import {OdataForeignKey} from "./server-object";
import {CustomLoadingFilterParams} from "./custom-loading-filter-params";
import {isArray} from "util";

export abstract class OdataContextDefinition {
    protected odataContext: ODataContext;

    // constructor(@Inject('config') private config: ContextModuleConfig) {
    //     console.log(this.getOdataContextEntitiesDefinition(config.entities));
    // }

    public abstract buildOdataContext(config: ContextModuleConfig);

    public getContext(): ODataContext {
        return this.odataContext;
    }

    protected getOdataContextServerObjectsDefinition(serverObjectsDescriptor: ServerObjectsDescriptor): any {
        const entities: Array<string> = Object.getOwnPropertyNames(serverObjectsDescriptor);
        return entities.reduce((obj: any, serverObject: any) => {obj[serverObjectsDescriptor[serverObject].name] = serverObjectsDescriptor[serverObject].class.getOdataContextEntity(); return obj}, {});
    }

    protected fixUpdate(keys, values, serverObjectName) {
        // console.log(keys, values, serverObjectName);

        // const fields = this.dataSource.store()["_fieldTypes"];
        const fields = this.odataContext[serverObjectName]._fieldTypes;
        for (const value in values) {
            console.log("value", value);
            if (!fields[value]) {
                delete values[value];
            }
        }

        for (const field in fields) {
            if (values[field] && fields[field] instanceof OdataForeignKey) {
                // console.log(fields[field].getTargetEntity(), values[field]);
                values[field] = this.odataContext.objectLink(
                    fields[field].getTargetEntity(), values[field][fields[field].getKeyName()]);
            }
        }
        // console.log(values);
    }

    protected setCustomConfiguration(defaultTimeZoneOffset: number, DefaultCurrency: string) {

        // customizzazione per filtri sulle date

        /**
         * @Override
         * Sovrascrivo la funzione standard della classe Date per il ritorno della timezone
         * @returns {number}
         */
        Date.prototype.getTimezoneOffset = function () {
            return defaultTimeZoneOffset;
        };

        keyConverters["DateTime"] = function (value) {
            const formattedDate = moment(value).format("YYYY-MM-DDTHH:mm:ss");
            return new EdmLiteral("datetime'" + formattedDate + "'");
        };

        const configObj = {
            defaultCurrency: DefaultCurrency,
            forceIsoDateParsing: true
        };
        config.default(configObj);
    }

    public customLoading (loadOption: any) {
        const customLoadingFilterParams: CustomLoadingFilterParams = loadOption.userData["customLoadingFilterParams"]
        // console.log("custom", customLoadingFilterParams);
        // console.log("option", loadOption);
        if (loadOption.filter != null && customLoadingFilterParams != null) {
            const currentFilter = loadOption.filter;
            const targetField: string = customLoadingFilterParams.getTargetField();
            for (const i in currentFilter) {
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

