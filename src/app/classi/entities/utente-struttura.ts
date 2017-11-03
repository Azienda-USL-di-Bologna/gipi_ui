import {Entity, OdataForeignKey} from "../context/entity";
import {AfferenzaStruttura} from "./afferenza-struttura";
import {Struttura} from "./struttura";
import {Utente} from "./utente";

export class UtenteStruttura extends Entity {
  id: number;
  idAfferenzaStruttura: AfferenzaStruttura;
  idStruttura: Struttura;
  idUtente: Utente;

  public static getOdataContextEntity(): any {
    return {
      key: "id",
      keyType: "Int32",
      fieldTypes: {
        id: "Int32",
        idAfferenzaStruttura: new OdataForeignKey(AfferenzaStruttura, "id"),
        idStruttura: new OdataForeignKey(Struttura, "id"),
        idUtente: new OdataForeignKey(Utente, "id")
      }
    }
  }
}
