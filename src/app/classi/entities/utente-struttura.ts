import {Entities, OdataForeignKey} from "../context/context-utils";
import {AfferenzaStruttura} from "./afferenza-struttura";
import {Struttura} from "./struttura";
import {Utente} from "./utente";

export class UtenteStruttura {
  id: number = null;
  idAfferenzaStruttura: AfferenzaStruttura = null;
  idStruttura: Struttura = null;
  idUtente: Utente = null;

  public static getOdataContextEntity(): any {
    return {
      key: "id",
      keyType: "Int32",
      fieldTypes: {
        id: "Int32",
        idAfferenzaStruttura: new OdataForeignKey(Entities.AfferenzaStruttura, "id"),
        idStruttura: new OdataForeignKey(Entities.Struttura, "id"),
        idUtente: new OdataForeignKey(Entities.Utente, "id")
      }
    }
  }

  constructor() {
  }
}
