import { Component } from "@angular/core";
import { GlobalContextService } from "@bds/nt-context";
import { LoggedUser } from "@bds/nt-login";
import { ActivatedRoute, Params } from "@angular/router";
import { IterParams } from "app/iter-procedimento/passaggio-di-fase/passaggio-di-fase.component";
import {bAzienda, bUtente} from "@bds/nt-entities";

@Component({
  selector: "avvia-nuovo-iter-da-documento",
  templateUrl: "./avvia-nuovo-iter-da-documento.component.html",
  styleUrls: ["./avvia-nuovo-iter-da-documento.component.scss"]
})
export class AvviaNuovoIterDaDocumentoComponent {
  public idAzienda: number;
  public doc: any; 
  public procedimentoDaPassare: object;
  public loggedUser: LoggedUser;

  constructor(private globalContextService: GlobalContextService, private activatedRoute: ActivatedRoute) {
    console.log("avvia-nuovo-iter-da-documento (constructor)");

    this.loggedUser = this.globalContextService.getInnerSharedObject("loggedUser");
    this.idAzienda = this.loggedUser.getField(bUtente.aziendaLogin)[bAzienda.id];

    this.activatedRoute.queryParams.subscribe((queryParams: Params) => {
      console.log("Data Registrazione: ", queryParams["dataRegistrazione"]);
      console.log("In Date: ", new Date(queryParams["dataRegistrazione"]));
      this.doc = {
        registro: queryParams["registro"],
        numero: queryParams["numero"],
        anno: queryParams["anno"],
        oggetto: decodeURIComponent(queryParams["oggetto"].replace(/\+/g, " ")),
        dataRegistrazione: queryParams["dataRegistrazione"],
        promotore: decodeURIComponent(queryParams["promotore"].replace(/\+/g, " "))
      };
    });
  }

  public receiveMessage(event: any) {
    this.procedimentoDaPassare = {
      procedimento: event.row.selectedRowsData[0]
    };
  }
}
