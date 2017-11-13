import {isArray} from "util";
import {arraysAreEqual} from "tslint/lib/utils";
import {ServerObjectDescriptor} from "./context-module-config";
export abstract class ServerObject {

    /**
     * da implementare nelle sottoclassi, deve tornare i dati che descrivono l'entità da inserire dentro l'oggetto OdataContext di DevExtreme
     */
    public static getOdataContextEntity(): any {
    }

    /**
     * costruisce l'oggetto a partire dai dati raw popolando le proprietà indicate nei fieldTypes dell'oggetto tornato dal metodo getOdataContextEntity()
     */
    public build(srcObj: any, entityClass: typeof ServerObject) {
        const properties: Array<string> = Object.getOwnPropertyNames(entityClass.getOdataContextEntity().fieldTypes);
        for (const prop of properties) {
            this[prop] = srcObj[prop];
        }
    }

    /**
     * torna true se i due oggetti sono uguali (vengono controllate solo le proprietà, non i metodi), false altrimenti
     * @param obj1
     * @param obj2
     * @returns {boolean} Torna true se i due oggetti sono uguali, false altrimenti
     */
    public static isEquals(obj1: any, obj2: any) {
        const properties: Array<string> = Object.getOwnPropertyNames(obj1);

        for (const prop of properties) {
            // console.log("prop name:", prop, "value:", obj1[prop], "type:", typeof obj1[prop]);
            // console.log("prop", isArray(obj1[prop]));
            let pippo = false;
            if (obj1[prop] && typeof obj1[prop] === "object") {
                if (isArray(obj1[prop])) {
                    if (!isArray(obj2[prop])) {
                        return false;
                    }
                    else {
                        console.log(obj1[prop], obj2[prop]);
                        if (!ServerObject.arrayEquals(obj1[prop], obj2[prop])) {
                            return false;
                        }
                    }
                }
                else {
                    if (!obj2[prop] || typeof obj2[prop] !== "object")
                        return false;
                    else
                    if (!ServerObject.isEquals(obj1[prop], obj2[prop])) {
                        return false;
                    }
                }
            } else {
                if (obj1[prop] !== obj2[prop]) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * confronta 2 array usando come funzione di ugualianza isEquals()
     * @param array1
     * @param array2
     * @returns {boolean}
     */
    private static arrayEquals(array1: Array<any>, array2: Array<any>): boolean {
        return arraysAreEqual(array1, array2, (a, b) => {return ServerObject.isEquals(a, b)});
    }
}

export class OdataForeignKey <T extends typeof ServerObject> {
    private targetEntity: string;
    private keyName: string;

    constructor(entityDescriptor: ServerObjectDescriptor, keyName: string) {
        this.keyName = keyName;
        this.targetEntity = entityDescriptor.name;
        // const entities: Array<string> = Object.getOwnPropertyNames(Entities);
        // for (const entity of entities) {
        //     if (Entities[entity].class === targetEntity) {
        //         this.targetEntity = Entities[entity].name;
        //         break;
        //     }
        // }
    }

    public getTargetEntity(): string {
        return this.targetEntity;
    }

    public getKeyName(): string {
        return this.keyName;
    }
}