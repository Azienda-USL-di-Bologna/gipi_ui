import {Inject, Injectable} from "@angular/core";
import {OdataContextDefinition} from "./odata-context-definition";
import {ContextModuleConfig} from "./context-module-config";
import {OdataContextEntitiesDefinition} from "./odata-context-entities-definition";
import {OdataContextViewsDefinition} from "./odata-context-views-definition";
import {OdataContextFunctionsImportDefinition} from "./odata-context-functions-import-definition";

@Injectable()
export class OdataContextFactory {
    constructor(@Inject('config') private config: ContextModuleConfig) {
    }

    public buildOdataContextEntitiesDefinition(): OdataContextEntitiesDefinition {
        const odataContextEntitiesDefinition: OdataContextEntitiesDefinition = new OdataContextEntitiesDefinition();
        odataContextEntitiesDefinition.buildOdataContext(this.config);
        return odataContextEntitiesDefinition;
    }

    public buildOdataContextViewsDefinition(): OdataContextViewsDefinition {
        const odataContextViewsDefinition: OdataContextViewsDefinition = new OdataContextViewsDefinition();
        odataContextViewsDefinition.buildOdataContext(this.config);
        return odataContextViewsDefinition;
    }

    public buildOdataFunctionsImportDefinition(): OdataContextFunctionsImportDefinition {
        const odataContextFunctionsImportDefinition: OdataContextFunctionsImportDefinition = new OdataContextFunctionsImportDefinition();
        odataContextFunctionsImportDefinition.buildOdataContext(this.config);
        return odataContextFunctionsImportDefinition;
    }
}
