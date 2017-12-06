import { Entity } from "@bds/nt-angular-context/entity";
import { Iter } from "./iter";
import { OdataForeignKey } from "@bds/nt-angular-context/server-object";
import { Entities } from "../../../../environments/app.constants";

export class DocumentoIter extends Entity {
  id: number;
  numeroRegistro: number;
  anno: number;
  registro: string;
  idGddoc: number;
  idIter: Iter;
  FK_id_iter: number;

  public static getOdataContextEntity(): any {
    return {
      key: "id",
      keyType: "Int32",
      fieldTypes: {
        id: "Int32",
        numeroRegistro: "Int32",
        anno: "Int32",
        registro: "String",
        idGddoc: "Int32",
        idIter: new OdataForeignKey(Entities.Iter, "id")
      }
    };
  }
}