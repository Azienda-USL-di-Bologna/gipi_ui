export class Ruolo {
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
}
