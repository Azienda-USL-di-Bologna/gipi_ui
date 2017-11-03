export class AfferenzaStruttura {
  id: number;
  descrizione: string;

  public static getOdataContextEntity(): any {
    return {
      key: "id",
      keyType: "Int32",
      fieldTypes: {
        id: "Int32",
        descrizione: "String"
      }
    }
  }
}
