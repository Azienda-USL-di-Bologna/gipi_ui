import { Entity } from "@bds/nt-angular-context/entity";
import { Entities}  from "../../../../environments/app.constants";
import { OdataForeignKey } from "@bds/nt-angular-context/server-object";
import { FaseIter } from "./fase-iter";

export class Fase extends Entity {
  id: number;
  nomeFase: string;
  ordinale: number;
  faseDiChiusura: boolean;
//   iterList: Iter[];
  fasiIter: FaseIter[];

  public static getOdataContextEntity(): any {
    return {
      key: "id",
      keyType: "Int32",
      fieldType: {
        id: "Int32",
        nomeFase: "String",
        ordinale: "Int32",
        faseDiChiusura: "Boolean"
      }
    }
  }
}
