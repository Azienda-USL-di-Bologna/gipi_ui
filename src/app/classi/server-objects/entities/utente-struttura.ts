import {Entity} from "../../../context/entity";
import {AfferenzaStruttura} from "./afferenza-struttura";
import {Struttura} from "./struttura";
import {Utente} from "./utente";
import {Entities} from "../../../../environments/app.constants";
import {OdataForeignKey} from "../../../context/server-object";

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
        idAfferenzaStruttura: new OdataForeignKey(Entities.AfferenzaStruttura, "id"),
        idStruttura: new OdataForeignKey(Entities.Struttura, "id"),
        idUtente: new OdataForeignKey(Entities.Utente, "id")
      }
    }
  }
}
