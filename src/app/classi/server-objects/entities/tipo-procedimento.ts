import {Azienda} from "../../aziende";
import {Entity} from "@bds/nt-angular-context/entity";

export class TipoProcedimento extends Entity{
    id: number;
    nome: string;
    descrizioneDefault: string;
    modoApertura: string;
    normaRiferimento: string;
    dataInizioValidita: Date;
    dataFineValidita: Date;
    durataMassimaSospensione: number;
    durataMassimaIter: number;
    aziendeAssociate: Array<Azienda>;
    codice: number;
    obbligoEsitoConclusivo: boolean;
    pubblicazioneRegistroAccessi: boolean;

    public static getOdataContextEntity(): any {
        return {
            key: "id",
            keyType: "Int32",
            fieldTypes: {
                id: "Int32",
                nome: "String",
                descrizioneDefault: "String",
                modoApertura: "String",
                normaRiferimento: "String",
                dataInizioValidita: "DateTime",
                dataFineValidita: "DateTime",
                durataMassimaSospensione: "Int32",
                durataMassimaIter: "Int32",
                codice: "Int32",
                obbligoEsitoConclusivo: "Boolean",
                pubblicazioneRegistroAccessi: "Boolean"
            }
        }
    }
}
