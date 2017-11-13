import ODataContext from "devextreme/data/odata/context";
import {OdataContextDefinition} from "./odata-context-definition";
import {ContextModuleConfig} from "./context-module-config";
export class OdataContextFunctionsImportDefinition extends OdataContextDefinition {

    constructor(){
        super()
    }

    public buildOdataContext(config: ContextModuleConfig) {
        if (!this.odataContext) {
            super.setCustomConfiguration(config.defaultTimeZoneOffset, config.defaultCurrency);
            this.odataContext = new ODataContext({
                url: config.odataBaseUrl,
                entities:super.getOdataContextServerObjectsDefinition(config.functionsImport),
                beforeSend: function (request: any) {
                    console.info(JSON.stringify(request));
                    request.headers = {"Authorization": "Bearer " + config.tokenProvider()};
                }
            });
            const functionsImport: Array<string> = Object.getOwnPropertyNames(config.functionsImport);
            for (const functionImport of functionsImport) {
                this.odataContext[config.functionsImport[functionImport].name].on("updating", (keys, values) => {
                    super.fixUpdate(keys, values, config.functionsImport[functionImport].name);
                });
                this.odataContext[config.functionsImport[functionImport].name].on("inserting", (values) => {
                    super.fixUpdate(null, values, config.functionsImport[functionImport].name);
                });
            }
        }
    }
}