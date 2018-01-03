import {Azienda} from "./azienda";
import {TipoProcedimento} from "./tipo-procedimento";
import {Titolo} from "./titolo";
import {OdataForeignKey} from "@bds/nt-angular-context/server-object";
import {Entities} from "../../../../environments/app.constants";
import {Entity} from "@bds/nt-angular-context/entity";
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
                idAzienda: new OdataForeignKey(Entities.Azienda, "id"),
                idTipoProcedimento: new OdataForeignKey(Entities.TipoProcedimento, "id"),
                idTitolo: new OdataForeignKey(Entities.Titolo, "id")
            }
        }
    }
}
