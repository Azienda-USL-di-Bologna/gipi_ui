import {Azienda} from "../../aziende";
import {Entity} from "@bds/nt-angular-context/entity";

export class TipoProcedimento extends Entity{
    idTipoProcedimento: number;
    nomeTipoProcedimento: string;
    descrizioneTipoProcedimentoDefault: string;
    modoApertura: string;
    normaRiferimento: string;
    dataInizioValidita: Date;
    dataFineValidita: Date;
    durataMassimaSospensione: string;
    aziendeAssociate: Array<Azienda>;

    public static getOdataContextEntity(): any {
        return {
            key: "idTipoProcedimento",
            keyType: "Int32",
            fieldTypes: {
                idTipoProcedimento: "Int32",
                nomeTipoProcedimento: "String",
                descrizioneTipoProcedimentoDefault: "String",
                modoApertura: "String",
                normaRiferimento: "String",
                dataInizioValidita: "DateTime",
                dataFineValidita: "DateTime",
                durataMassimaSospensione: "String"
            }
        }
    }
}
