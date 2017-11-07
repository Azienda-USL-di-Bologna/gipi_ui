import {Azienda} from "./azienda";
import {TipoProcedimento} from "./tipo-procedimento";
import {Titolo} from "./titolo";
import {Entity, OdataForeignKey} from "../context/entity";
export class AziendaTipoProcedimento extends Entity {
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
    procedimentoList: Array<Titolo>;

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
                idAzienda: new OdataForeignKey(Azienda, "id"),
                idTipoProcedimento: new OdataForeignKey(TipoProcedimento, "idTipoProcedimento"),
                idTitolo: new OdataForeignKey(Titolo, "id")
            }
        }
    }
}
