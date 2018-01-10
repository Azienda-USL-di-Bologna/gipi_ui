import {Entity} from "@bds/nt-angular-context/entity";
export class Ruolo extends Entity {
  id: number;
  nome: string;
  nomeBreve: string;
  mascherBit: number;
  superaziendale: boolean;

  public static getOdataContextEntity(): any {
    return {
      key: "id",
      keyType: "Int32",
      fieldTypes: {
        id: "Int32",
        nome: "String",
        nomeBreve: "String",
        mascheraBit: "Int32",
        superaziendale: "Boolean"
      }
    };
  }

  constructor(){
    super();
  }
}
