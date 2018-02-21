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
  
  /* = {
    registro: "PG",
    numero: "66",
    anno: 2018,
    oggetto: "bell'oggetto, lo faccio corto, ma non è corto, soprattutto se lo spiego",
    dataRegistrazione: new Date(),
    promotore: "GSLFNSSTICA io sono il proponentre siiii"
  }; */

  public procedimentoDaPassare: object;
  public loggedUser: LoggedUser;

  constructor(private globalContextService: GlobalContextService, private activatedRoute: ActivatedRoute) {
    console.log("avvia-nuovo-iter-da-documento (constructor)");

    this.loggedUser = this.globalContextService.getInnerSharedObject("loggedUser");
    this.idAzienda = this.loggedUser.getField(bUtente.aziendaLogin)[bAzienda.id];

    this.activatedRoute.queryParams.subscribe((queryParams: Params) => {
      this.doc = {
        registro: queryParams["registro"],
        numero: queryParams["numero"],
        anno: queryParams["anno"],
        oggetto: queryParams["oggetto"],
        dataRegistrazione: queryParams["dataRegistrazione"],
        promotore: queryParams["promotore"]
      };
      console.log(this.doc);
    });
  }

  public receiveMessage(event: any) {
    console.log(event);
    this.procedimentoDaPassare = {
      /* idAzienda: this.idAzienda,
      idProcedimento: event.row.selectedRowsData[0].id,
      nomeProcedimento: event.row.selectedRowsData[0].idAziendaTipoProcedimento.idTipoProcedimento.nome
        + " (" + event.row.selectedRowsData[0].idStruttura.nome + ")", */
      procedimento: event.row.selectedRowsData[0]
    };
  }


}
