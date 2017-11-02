import {Azienda} from "../aziende";
import {TipoProcedimento} from "./tipo-procedimento";
import {Titolo} from "./titolo";
import {Entities, OdataForeignKey} from "../context/context-utils";
export class AziendaTipoProcedimento {
    id: number;
    dataFine: Date;
    dataInizio: Date;
    descrizioneTipoProcedimento: string;
    durataMassimaProcedimento: string;
    durataMassimaSospensione: string;
    obbligoEsitoConclusivo: boolean;
    FK_id_azienda: number;
    idAzienda: Azienda;
    FK_id_tipo_procedimento: number;
    idTipoProcedimento: TipoProcedimento;
    FK_id_titolo: number;
    idTitolo: Titolo;
    //procedimentoList: Array<Procedimento>;

    public static getOdataContextEntity(): any {
        return {
            key: "id",
            keyType: "Int32",
            fieldTypes: {
                id: "Int32",
                descrizioneTipoProcedimento: "String",
                dataFine: "DateTime",
                dataInizio: "DateTime",
                durataMassimaProcedimento: "String",
                durataMassimaSospensione: "String",
                obbligoEsitoConclusivo: "Boolean",
                idAzienda: new OdataForeignKey(Entities.Azienda, "id"),
                idTipoProcedimento: new OdataForeignKey(Entities.TipoProcedimento, "idTipoProcedimento"),
                idTitolo: new OdataForeignKey(Entities.Titolo, "id")
            }
        }
    }
}
