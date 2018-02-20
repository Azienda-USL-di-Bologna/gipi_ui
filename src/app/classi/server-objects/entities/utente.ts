import {Azienda} from "./azienda";
import {Entities} from "../../../../environments/app.constants";
import {Entity} from "@bds/nt-angular-context/entity";
import {OdataForeignKey} from "@bds/nt-angular-context/server-object";

export class Utente extends Entity {
  id: number;
  attivo: boolean;
  codiceFiscale: string;
  codiceStruttura: string;
  cognome: string;
  descrizione: string;
  dominio: number;
  email: string;
  fax: string;
  idInquadramento: number;
  matricola: string;
  nome: string;
  omonimia: boolean;
  passwordHash: string;
  telefono: string;
  username: string;
  FK_id_azienda: number;
  idAzienda: Azienda;
  bitRuoli: number;

  public static getOdataContextEntity(): any {
    return {
      key: "id",
      keyType: "Int32",
      fieldTypes: {
        id: "Int32",
        username: "String",
        attivo: "Boolean",
        codiceStruttura: "String",
        descrizione: "String",
        dominio: "String",
        email: "String",
        fax: "String",
        idInquadramento: "Int32",
        omonimia: "Boolean",
        passwordHash: "String",
        telefono: "String",
        bitRuoli: "Int32",
        idAzienda: new OdataForeignKey(Entities.Azienda, "id")
      }
    };
  }
}
