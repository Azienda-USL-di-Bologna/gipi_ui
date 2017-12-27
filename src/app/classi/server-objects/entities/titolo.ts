import {Entity} from "@bds/nt-angular-context/entity";
export class Titolo extends Entity {
    id: number;
    nome: string;
    idAzienda: number;
    classificazione: string;

    public static getOdataContextEntity(): any {
        return {
            key: "id",
            keyType: "Int32",
            fieldTypes: {
                id: "Int32",
                nome: "String",
                idAzienda: "Int32",
                classificazione: "String"

            }
        }
    }
}

