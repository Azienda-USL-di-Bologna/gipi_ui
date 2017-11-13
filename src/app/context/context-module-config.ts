import {Entity} from "./entity";
import {View} from "./view";
import {FunctionImport} from "./function-import";
import {ServerObject} from "./server-object";

export interface ServerObjectDescriptor {
    name: string,
    class: typeof ServerObject
}

export interface EntityDescriptor extends ServerObjectDescriptor {
    class: typeof Entity
}

export interface ViewDescriptor extends ServerObjectDescriptor {
    class: typeof View
}

export interface FunctionImportDescriptor extends ServerObjectDescriptor {
    class: typeof FunctionImport
}

export declare type ServerObjectsDescriptor  = {
    [key: string]: ServerObjectDescriptor
}

export interface ContextModuleConfig {
    odataBaseUrl: string;
    entities: ServerObjectsDescriptor;
    views?: ServerObjectsDescriptor;
    functionsImport?: ServerObjectsDescriptor;
    tokenProvider?: () => string;
    defaultTimeZoneOffset: number;
    defaultCurrency: string;
}