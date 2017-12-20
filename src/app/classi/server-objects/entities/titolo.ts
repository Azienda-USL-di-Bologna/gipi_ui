import {Entity} from "@bds/nt-angular-context/entity";
export class Titolo extends Entity {
    idTitolo: number;
    nomeTitolo: string;
    idAzienda: number;
    classificazione: string;

    public static getOdataContextEntity(): any {
        return {
            key: "idTitolo",
            keyType: "Int32",
            fieldTypes: {
                idTitolo: "Int32",
                nomeTitolo: "String",
                idAzienda: "Int32",
                classificazione: "String"
            }
        }
    }
}

