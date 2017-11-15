import {Azienda} from "./azienda";
import {Ruolo} from "./ruolo";
import {Entities} from "../../../../environments/app.constants";
import {Entity} from "@bds/nt-angular-context/entity";
import {OdataForeignKey} from "@bds/nt-angular-context/server-object";

export class Utente extends Entity {
  attivo: boolean;
  codiceFiscale: string;
  codiceStruttura: string;
  cognome: string;
  descrizione: string;
  dominio: number;
  email: string;
  fax: string;
  id: number;
  idInquadramento: number;
  matricola: string;
  nome: string;
  omonimia: boolean;
  passwordHash: string;
  telefono: string;
  username: string;
  FK_id_azienda: number;
  idAzienda: Azienda;
  FK_id_ruolo: number;
  idRuolo: Ruolo;

  public static getOdataContextEntity(): any {
    return {
      key: "id",
      keyType: "Int32",
      fieldTypes: {
        id: "Int32",
        username: "String",
        nome: "String",
        cognome: "String",
        attivo: "Boolean",
        codiceFiscale: "String",
        codiceStruttura: "String",
        descrizione: "String",
        dominio: "String",
        email: "String",
        fax: "String",
        idInquadramento: "Int32",
        matricola: "String",
        omonimia: "Boolean",
        passwordHash: "String",
        telefono: "String",
        idRuolo: new OdataForeignKey(Entities.Ruolo, "id"),
        idAzienda: new OdataForeignKey(Entities.Azienda, "id")
      }
    }
  }
}
