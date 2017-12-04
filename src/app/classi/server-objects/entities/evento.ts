import { Entity } from '@bds/nt-angular-context/entity';

export class Evento extends Entity {
  id: number;
  nomeEvento: string;

  public static getOdataContextEntity(): any {
    return {
      key: "id",
      keyType: "Int32",
      fieldTypes: {
        id: "Int32",
        nomeEvento: "String"
      }
    }
  }
}
