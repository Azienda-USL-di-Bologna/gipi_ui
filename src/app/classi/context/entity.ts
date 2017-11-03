import {Entities} from "../../../environments/app.constants";
export abstract class Entity {

  /**
   * da implementare nelle sottoclassi, deve tornare i dati che descrivono l'entità da inserire dentro l'oggetto OdataContext di DevExtreme
   */
  public static getOdataContextEntity(): any {
  }
}

export class OdataForeignKey {
  private targetEntity: string;
  private keyName: string;

  constructor(targetEntity: Entity, keyName: string) {
    this.keyName = keyName;
    const entities: Array<string> = Object.getOwnPropertyNames(Entities);
    for (const entity of entities) {
      if (Entities[entity].class === targetEntity) {
        this.targetEntity = Entities[entity].name
        break;
      }
    }
  }

  public getTargetEntity(): string {
    return this.targetEntity;
  }

  public getKeyName(): string {
    return this.keyName;
  }
}