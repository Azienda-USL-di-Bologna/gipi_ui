import {Injectable} from "@angular/core";
import ODataContext from "devextreme/data/odata/context";
import {ODATA_STORE_ROOT_URL, DEFAULT_CURRENCY, DEFAULT_TIMEZONE_OFFSET, odataAziendeTipiProcPath} from "../../../environments/app.constant";
import {keyConverters, EdmLiteral} from 'devextreme/data/odata/utils';
import * as moment from 'moment';
import * as config from 'devextreme/core/config';
import {Entities, OdataForeignKey} from "./context-utils";
import {Azienda} from "../entities/azienda";
import {Utente} from "../entities/utente";
import {Struttura} from "../entities/struttura";
import {UtenteStruttura} from "../entities/utente-struttura";
import {AfferenzaStruttura} from "../entities/afferenza-struttura";
import {TipoProcedimento} from "../entities/tipo-procedimento";
import {AziendaTipoProcedimento} from "../entities/azienda-tipo-procedimento";
import {Titolo} from "../entities/titolo";
import {isArray} from "rxjs/util/isArray";
import {CustomLoadingFilterParams} from "../custom-loading-filter-params";
import {Ruolo} from "../entities/ruolo";

@Injectable()
export class OdataContextDefinition {
private odataContext:ODataContext;

    constructor() {
        if (!this.odataContext) {
            this.setCustomConfiguration();
            this.odataContext = new ODataContext({
                url: ODATA_STORE_ROOT_URL,
                entities: {
                    [Entities.Azienda]: Azienda.getOdataContextEntity(),
                    [Entities.Utente]: Utente.getOdataContextEntity(),
                    [Entities.Struttura]: Struttura.getOdataContextEntity(),
                    [Entities.UtenteStruttura]: UtenteStruttura.getOdataContextEntity(),
                    [Entities.AfferenzaStruttura]: AfferenzaStruttura.getOdataContextEntity(),
                    [Entities.TipoProcedimento]: TipoProcedimento.getOdataContextEntity(),
                    [Entities.AziendaTipoProcedimento]: AziendaTipoProcedimento.getOdataContextEntity(),
                    [Entities.Titolo]: Titolo.getOdataContextEntity(),
                    [Entities.Ruolo]: Ruolo.getOdataContextEntity()
                }
            });

            const entities: Array<string> = Object.getOwnPropertyNames(Entities);
            for (const entity of entities) {
                console.log(entity);
                console.log(Entities[entity]);

                this.odataContext[Entities[entity]].on("updating", (keys, values) => {
                    this.fixUpdate(keys, values, Entities[entity]);
                });
                console.log(this.odataContext[Entities[entity]].on)
                this.odataContext[Entities[entity]].on("inserting", (values) => {
                    this.fixUpdate(null, values, Entities[entity]);
                });
            }
        }
    }

    public getContext(): ODataContext {
        return this.odataContext;
    }

    public fixUpdate(keys, values, entityName) {
        console.log(keys, values, entityName);

        // const fields = this.dataSource.store()["_fieldTypes"];
        const fields = this.odataContext[entityName]._fieldTypes;

        for (let value in values) {
            console.log("value", value);
            if (!fields[value]) {
                delete values[value];
            }
        }

        for (const field in fields) {
            if (values[field] && fields[field] instanceof OdataForeignKey) {
                console.log(fields[field].getTargetEntity(), values[field]);
                values[field] = this.odataContext.objectLink(
                    fields[field].getTargetEntity(), values[field][fields[field].getKeyName()]);
            }
        }
        console.log(values);
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

    private setCustomConfiguration() {
        keyConverters['DateTime'] = function (value) {
            const formattedDate = moment(value).format('YYYY-MM-DDTHH:mm:ss');
            return new EdmLiteral('datetime\'' + formattedDate + '\'');
        };

        const configObj = {
            defaultCurrency: DEFAULT_CURRENCY,
            forceIsoDateParsing: true
        };
        config.default(configObj);
    }
}
