import {ContextModuleConfig} from "@bds/nt-angular-context/context-module-config";
import {DEFAULT_CURRENCY, DEFAULT_TIMEZONE_OFFSET, Entities, FunctionsImport, ODATA_BASE_URL} from "../environments/app.constants";
import {JwtInterceptor} from "./authentication-jwt/jwt.interceptor";

console.log("dentro module", ODATA_BASE_URL);
    export const contextModuleConfig: ContextModuleConfig =  {
        odataBaseUrl: ODATA_BASE_URL,
        entities: Entities,
        views: null,
        functionsImport: FunctionsImport,
        defaultTimeZoneOffset: DEFAULT_TIMEZONE_OFFSET,
        defaultCurrency: DEFAULT_CURRENCY,
        tokenProvider: JwtInterceptor.getToken
    };

