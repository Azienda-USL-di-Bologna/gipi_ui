import {Entity} from "../context/entity";
export class Titolo extends Entity {
    idTitolo: number;
    nomeTitolo: string;
    idAzienda: number;

    public static getOdataContextEntity(): any {
        return {
            key: "idTitolo",
            keyType: "Int32",
            fieldTypes: {
                idTitolo: "Int32",
                nomeTitolo: "String",
                idAzienda: "Int32"
            }
        }
    }

    public gdmgdm(obj): any {
        // return super.isEquals(obj);
        // const propertiesObj1: Array<string> = Object.getOwnPropertyNames(this);
        //
        // for (const prop of propertiesObj1) {
        //     console.log("1", prop);
        //     if (this[prop] === obj[prop]) {
        //         console.log(prop, "uguale")
        //     }
        //     else {
        console.log("diversa")
        //     }
        // }
    }
}

