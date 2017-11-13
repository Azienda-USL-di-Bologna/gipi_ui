import {Azienda} from "./azienda";
import {Entity} from "../../../context/entity";
import {Entities} from "../../../../environments/app.constants";
import {OdataForeignKey} from "../../../context/server-object";
export class Struttura extends Entity {
  id: number;
  attiva: boolean;
  codice: number;
  codiceDislocazione: string;
  dataAttivazione: Date;
  dataCessazione: Date;
  dislocazione: string;
  nome: string;
  spettrale: boolean;
  usaSegreteriaBucataPadre: boolean;
  FK_id_azienda: number;
  idAzienda: Azienda;
  FK_id_struttura_padre: number;
  idStrutturaPadre: Struttura;
  FK_id_struttura_segreteria: number;
  idStrutturaSegreteria: Struttura;

  public static getOdataContextEntity(): any {
    return {
      key: "id",
      keyType: "Int32",
      fieldType: {
        id: "Int32",
        attiva: "Boolean",
        codice: "Int32",
        codiceDislocazione: "String",
        dataAttivazione: "DateTime",
        dataCessazione: "DateTime",
        dislocazione: "String",
        nome: "String",
        spettrale: "Boolean",
        usaSegreteriaBucataPadre: "Boolean",
        idAzienda: new OdataForeignKey(Entities.Azienda, "id"),
        idStrutturaPadre: new OdataForeignKey(Entities.Struttura, "id"),
        idStrutturaSegreteria: new OdataForeignKey(Entities.Struttura, "id"),
      }
    }
  }
}
