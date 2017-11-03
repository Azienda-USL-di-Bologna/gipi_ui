import {Injectable} from "@angular/core";
import ODataContext from "devextreme/data/odata/context";
import {ODATA_BASE_URL, DEFAULT_CURRENCY, DEFAULT_TIMEZONE_OFFSET, Entities} from "../../../environments/app.constants";
import {keyConverters, EdmLiteral} from "devextreme/data/odata/utils";
import {MyContext} from "../entities/my-context";
import * as moment from "moment";
import * as config from "devextreme/core/config";
import {OdataForeignKey} from "./entity";

@Injectable()
export class OdataContextDefinition {
    private odataContext: ODataContext;

    constructor() {

        if (!this.odataContext) {
            this.setCustomConfiguration();
            this.odataContext = new ODataContext({
                url: ODATA_BASE_URL,
                entities: MyContext.getOdataContextEntitiesDefinition()
            });
            const entities: Array<string> = Object.getOwnPropertyNames(Entities);
            for (const entity of entities) {
                this.odataContext[Entities[entity].name].on("updating", (keys, values) => {
                    this.fixUpdate(keys, values, Entities[entity].name);
                });
                this.odataContext[Entities[entity].name].on("inserting", (values) => {
                    this.fixUpdate(null, values, Entities[entity].name);
                });
            }
        }
    }

    public getContext(): ODataContext {
        return this.odataContext;
    }

    public fixUpdate(keys, values, entityName) {
        // console.log(keys, values, entityName);

        // const fields = this.dataSource.store()["_fieldTypes"];
        const fields = this.odataContext[entityName]._fieldTypes;
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

    private setCustomConfiguration() {

        // customizzazione per filtri sulle date

        /**
         * @Override
         * Sovrascrivo la funzione standard della classe Date per il ritorno della timezone
         * @returns {number}
         */
        Date.prototype.getTimezoneOffset = function () {
            return DEFAULT_TIMEZONE_OFFSET;
        };

        keyConverters["DateTime"] = function (value) {
            const formattedDate = moment(value).format("YYYY-MM-DDTHH:mm:ss");
            return new EdmLiteral("datetime'" + formattedDate + "'");
        };

        const configObj = {
            defaultCurrency: DEFAULT_CURRENCY,
            forceIsoDateParsing: true
        };
        config.default(configObj);
    }
}

