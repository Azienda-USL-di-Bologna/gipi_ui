import {
    DEFAULT_CURRENCY, DEFAULT_TIMEZONE_OFFSET, HOME_ROUTE, LOCALHOST_PORT, LOGIN_RELATIVE_URL, LOGIN_ROUTE,
    ODATA_BASE_URL
} from "../../environments/app.constants";
import {ModuleConfig, JwtInterceptor} from "@bds/nt-login";
import {ContextModuleConfig} from "@bds/nt-context";
import {getEntitiesConfiguration, getFunctionsImportConfiguration} from "./server-objects-configuration";
import {odataStoreErrorHandler} from "../classi/error-handling/error-handlers";

console.log("dentro module", ODATA_BASE_URL);
    export const contextModuleConfig: ContextModuleConfig =  {
        odataBaseUrl: ODATA_BASE_URL,
        entities: getEntitiesConfiguration,
        views: null,
        functionsImport: getFunctionsImportConfiguration,
        defaultTimeZoneOffset: DEFAULT_TIMEZONE_OFFSET,
        defaultCurrency: DEFAULT_CURRENCY,
        tokenProvider: JwtInterceptor.getToken,
        errorHandler: odataStoreErrorHandler
    };

    export const loginModuleConfig: ModuleConfig = {
        relativeURL: LOGIN_RELATIVE_URL,
        loginComponentRoute: LOGIN_ROUTE,
        homeComponentRoute: HOME_ROUTE,
        localhostPort: LOCALHOST_PORT
    };

// export class contextModuleConfig implements ContextModuleConfig  {
//     odataBaseUrl = ODATA_BASE_URL;
//     entities = new Entities();
//     views = null;
//     // functionsImport: FunctionsImport,
//     defaultTimeZoneOffset= DEFAULT_TIMEZONE_OFFSET;
//     defaultCurrency= DEFAULT_CURRENCY;
//     tokenProvider= JwtInterceptor.getToken;
// }