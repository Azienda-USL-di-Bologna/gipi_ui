import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Iter } from "app/classi/server-objects/entities/iter";
import { OdataContextFactory } from "@bds/nt-angular-context";
import { OdataContextDefinition } from "@bds/nt-angular-context/odata-context-definition";
import { CustomLoadingFilterParams } from "@bds/nt-angular-context/custom-loading-filter-params";
import { Entities, CUSTOM_RESOURCES_BASE_URL, afferenzaStruttura } from "environments/app.constants";
import { HttpClient } from "@angular/common/http";
import notify from "devextreme/ui/notify";
import { forEach } from "@angular/router/src/utils/collection";
import { HttpHeaders } from "@angular/common/http";

@Component({
  selector: "avvia-nuovo-iter",
  templateUrl: "./avvia-nuovo-iter.component.html",
  styleUrls: ["./avvia-nuovo-iter.component.scss"]
})
export class AvviaNuovoIterComponent {

  public dataSourceUtenti: any;
  public iterParams: IterParams = new IterParams();
  public nomeProcedimento: string;
  public utenteConnesso: any;
  
  @Input()
  set procedimentoSelezionato(procedimento: any) {
    this.nomeProcedimento = procedimento.nomeProcedimento;
    this.iterParams = new IterParams();
    this.iterParams.idProcedimento = procedimento.id;
    this.iterParams.idAzienda = procedimento.idAzienda;
    this.iterParams.dataCreazioneIter = new Date();
  }

  @Output("messageEvent") messageEvent = new EventEmitter<any>();

  private odataContextDefinition: OdataContextDefinition;

  constructor(private odataContextFactory: OdataContextFactory, private http: HttpClient) {
    this.odataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
    this.getInfoSessionStorage();
    this.buildDataSourceUtenti();
  }

  public handleEvent(name: string, data: any) {
    switch (name) {
      case "onClickProcedi":
        this.avviaIter();
      break;
      case "onClickAnnulla":
        this.closePopUp();
      break;
    }
  }

  public closePopUp(idIter?: number) {
    this.messageEvent.emit({visible: false, idIter: idIter});
  }

  private getInfoSessionStorage() {
    this.utenteConnesso = JSON.parse(sessionStorage.getItem("userInfoMap")).idUtente;

    for (let s of JSON.parse(sessionStorage.getItem("userInfoMap")).strutture) {
      if (s.idAfferenzaStruttura === afferenzaStruttura.diretta) {
        this.iterParams.idStrutturaUtente = s.id;
      }
    }
  }

  private buildDataSourceUtenti() {
    const customOdataContextDefinition: OdataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
    const customLoadingFilterParams: CustomLoadingFilterParams = new CustomLoadingFilterParams("descrizione");
    customLoadingFilterParams.addFilter(["tolower(${target})", "contains", "${value.tolower}"]);
    this.dataSourceUtenti = {
      store: customOdataContextDefinition.getContext()[Entities.Utente.name].on("loading", (loadOptions) => {
        loadOptions.userData["customLoadingFilterParams"] = customLoadingFilterParams;
        customOdataContextDefinition.customLoading(loadOptions);
      }),
      paginate: true,
      pageSize: 15
    };
  }

  private campiObbligatoriCompilati() {
    if (this.iterParams.dataAvvioIter == null || this.iterParams.oggettoIter == null || this.iterParams.oggettoIter === "" || 
    this.iterParams.numeroDocumento == null || this.iterParams.annoDocumento == null || this.iterParams.codiceRegistroDocumento == null || 
    this.iterParams.codiceRegistroDocumento === "") {
      this.showStatusOperation("Per avviare un nuovo iter tutti i campi sono obbligatori", "warning");
      return false;
    }
    return true;
  }

  private avviaIter() {
    if (this.campiObbligatoriCompilati()) {
      const req = this.http.post(CUSTOM_RESOURCES_BASE_URL + "iter/avviaNuovoIter", this.iterParams, {headers: new HttpHeaders().set("content-type", "application/json")}) // Object.assign({}, this.iterParams))
      .subscribe(
        res => {
          console.log("Apertura della pagina dell'iter appena creato");
          console.log(res);
          let idIter = +res["idIter"]; 
          this.closePopUp(idIter);
        },
        err => {
          this.showStatusOperation("L'avvio del nuovo iter è fallito. Contattare Babelcare", "error");
        }
      );
    }
  }

  private showStatusOperation(message: string, type: string) {
    notify({
      message: message,
      type: type,
      displayTime: 2100,
       position: {
          my: "center", at: "center", of: window
        },
        width: "max-content"
    });
  }
}

class IterParams {
  public idUtente: number;
  public idStrutturaUtente: number;
  public idProcedimento: number;
  public idAzienda: number;
  public oggettoIter: string;
  public dataCreazioneIter: Date;
  public dataAvvioIter: Date;
  public codiceRegistroDocumento: string;
  public numeroDocumento: number;
  public annoDocumento: number;
}