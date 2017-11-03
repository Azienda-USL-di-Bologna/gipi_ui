import {Entities} from "../../../environments/app.constants";

export class MyContext {

  public static getOdataContextEntitiesDefinition(): any {
    const entities: Array<string> = Object.getOwnPropertyNames(Entities);
    return entities.reduce((obj: any, entity: any) => {obj[Entities[entity].name] = Entities[entity].class.getOdataContextEntity(); return obj}, {});
  }
}
