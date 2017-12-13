import { Entity } from "@bds/nt-angular-context/entity";
import { Entities}  from "../../../../environments/app.constants";
import { OdataForeignKey } from "@bds/nt-angular-context/server-object";
import { Utente } from "./utente";
import { Struttura } from "./struttura";
import { Iter } from "./iter";

export class ProcedimentoCache extends Entity {
  idIter: number;
  nomeTipoProcedimento: string;
  descrizioneTipoProcedimento: string;
  idStruttura: Struttura;
  idTitolarePotereSostitutivo: Utente;
  durataMassimaProcedimento: number;
  durataMasiimaSospensione: number;
  iter: Iter;

  public static getOdataContextEntity(): any {
    return {
      key: "idIter",
      keyType: "Int32",
      fieldTypes: {
        idIter: "Int32",
        nomeTipoProcedimento: "String",
        descrizioneTipoProcedimento: "String",
        idStruttura: new OdataForeignKey(Entities.Struttura, "id"),
        idTitolarePotereSostitutivo: new OdataForeignKey(Entities.Utente, "id"),
        durataMassimaProcedimento: "Int32",
        durataMassimaSospensione: "Int32"
      }
    }
  }
}
