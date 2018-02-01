import { Entity } from "@bds/nt-angular-context/entity";
import { Iter } from "./iter";
import { OdataForeignKey } from "@bds/nt-angular-context/server-object";
import { Entities } from "../../../../environments/app.constants";

export class DocumentoIter extends Entity {
  id: number;
  numeroRegistro: string;
  anno: number;
  registro: string;
  idIter: Iter;
  FK_id_iter: number;

  public static getOdataContextEntity(): any {
    return {
      key: "id",
      keyType: "Int32",
      fieldTypes: {
        id: "Int32",
        numeroRegistro: "String",
        anno: "Int32",
        registro: "String",
        idIter: new OdataForeignKey(Entities.Iter, "id")
      }
    };
  }
}