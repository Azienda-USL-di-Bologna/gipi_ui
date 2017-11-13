import {Struttura} from "./struttura";
import {AziendaTipoProcedimento} from "./azienda-tipo-procedimento";
import {Entity} from "../../../context/entity";
export class Azienda extends Entity {
  id: number;
  nome: string;
  aoo: string;
  codice: string;
  descrizione: string;
  idAziendaGru: number;
  schemaGru: string;
  strutturaList: Array<Struttura>;
  aziendaTipoProcedimentoList: Array<AziendaTipoProcedimento>;

  public static getOdataContextEntity(): any {
    return {
      key: "id",
      keyType: "Int32",
      fieldTypes: {
        id: "Int32",
        nome: "String",
        aoo: "String",
        codice: "String",
        descrizione: "String",
        idAziendaGru: "Int32",
        schemaGru: "String"
      }
    }
  }
}
