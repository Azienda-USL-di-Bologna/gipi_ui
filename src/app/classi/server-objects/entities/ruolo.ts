import {Entity} from "../../../context/entity";
export class Ruolo extends Entity {
  id: number;
  titolo: string;

  public static getOdataContextEntity(): any {
    return {
      key: "id",
      keyType: "Int32",
      fieldTypes: {
        id: "Int32",
        titolo: "String"
      }
    }
  }

  constructor(){
    super();
  }
}
