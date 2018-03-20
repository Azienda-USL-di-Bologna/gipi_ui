import {Entity} from "@bds/nt-context";
import {HttpClient, HttpHeaders} from "@angular/common/http";

export class PersistenceContextStore {
  private entityUrl: string;
  private httpClient: HttpClient;

  constructor(entityName: string, baseUrl: string, httpClient: HttpClient) {

    this.entityUrl = baseUrl + "/" + entityName;
    this.httpClient = httpClient;
  }

  public update(id: any, obj: any): void {
    this.httpClient.patch(this.entityUrl + "/" + id.toString(), obj, { headers: new HttpHeaders().set("content-type", "application/json") }).subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.error(err);
      }
    );
  }
}