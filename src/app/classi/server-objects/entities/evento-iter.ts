import { Entity } from "@bds/nt-angular-context/entity";
import { Evento } from "./evento";
import { Iter } from "./iter";
import { FaseIter } from "./fase-iter";
import { OdataForeignKey } from "@bds/nt-angular-context/server-object";
import { Entities } from "../../../../environments/app.constants";
import { DocumentoIter } from "app/classi/server-objects/entities/documento-iter";
import { Utente } from "app/classi/server-objects/entities/utente";

export class EventoIter extends Entity {
  id: number;
  idEvento: Evento;
  FK_id_evento: number;
  idIter: Iter;
  FK_id_iter: number;
  idFaseIter: FaseIter;
  FK_id_fase_iter: number;
  idDocumentoIter: DocumentoIter;
  FK_id_documento_iter: number;
  dataOraEvento: Date;
  autore: Utente;
  FK_autore: number;
  note: string;

  public static getOdataContextEntity(): any {
    return {
      key: "id",
      keyType: "Int32",
      fieldTypes: {
        id: "Int32",
        idEvento: new OdataForeignKey(Entities.Evento, "id"),
        idIter: new OdataForeignKey(Entities.Iter, "id"),
        idFaseIter: new OdataForeignKey(Entities.FaseIter, "id"),
        idDocumentoIter: new OdataForeignKey(Entities.DocumentoIter, "id"),
        dataOraEvento: "DateTime",
        autore: new OdataForeignKey(Entities.Utente, "id"),
        note: "String"
      }
    };
  }
}