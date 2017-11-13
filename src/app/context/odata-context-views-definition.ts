import ODataContext from "devextreme/data/odata/context";
import {OdataContextDefinition} from "./odata-context-definition";
import {ContextModuleConfig} from "./context-module-config";
export class OdataContextViewsDefinition extends OdataContextDefinition {

    constructor(){
        super()
    }

    public buildOdataContext(config: ContextModuleConfig) {
        if (!this.odataContext) {
            super.setCustomConfiguration(config.defaultTimeZoneOffset, config.defaultCurrency);
            this.odataContext = new ODataContext({
                url: config.odataBaseUrl,
                entities:super.getOdataContextServerObjectsDefinition(config.views),
                beforeSend: function (request: any) {
                    console.info(JSON.stringify(request));
                    request.headers = {"Authorization": "Bearer " + config.tokenProvider()};
                }
            });
            const views: Array<string> = Object.getOwnPropertyNames(config.views);
            for (const view of views) {
                this.odataContext[config.views[view].name].on("updating", (keys, values) => {
                    super.fixUpdate(keys, values, config.views[view].name);
                });
                this.odataContext[config.views[view].name].on("inserting", (values) => {
                    super.fixUpdate(null, values, config.views[view].name);
                });
            }
        }
    }
}
