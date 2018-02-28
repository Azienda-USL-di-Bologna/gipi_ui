import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Utente, bUtente, bAzienda, Procedimento, GetUtentiGerarchiaStruttura } from "@bds/nt-entities";
import { OdataContextFactory } from "@bds/nt-context";
import { OdataContextDefinition } from "@bds/nt-context";
import { CustomLoadingFilterParams } from "@bds/nt-context";
import { CUSTOM_RESOURCES_BASE_URL } from "environments/app.constants";
import { HttpClient } from "@angular/common/http";
import notify from "devextreme/ui/notify";
import { HttpHeaders } from "@angular/common/http";
import { OnInit } from "@angular/core/src/metadata/lifecycle_hooks";
import { LoggedUser } from "@bds/nt-login";
import { GlobalContextService } from "@bds/nt-context";
import { confirm, custom } from "devextreme/ui/dialog";
import DataSource from "devextreme/data/data_source";

@Component({
  selector: "avvia-nuovo-iter",
  templateUrl: "./avvia-nuovo-iter.component.html",
  styleUrls: ["./avvia-nuovo-iter.component.scss"]
})
export class AvviaNuovoIterComponent implements OnInit {

  private odataContextDefinitionFunctionImport: OdataContextDefinition;
  
  public avviaIterDaDocumento: boolean;
  public dataSourceUtenti: DataSource;
  public iterParams: IterParams = new IterParams();
  public nomeProcedimento: string;
  public dataMassimaConclusione: Date;
  public loggedUser: LoggedUser;
  public now: Date = new Date();
  public searchString: string = "";
  public idUtenteDefault: number;
  public descrizioneUtenteResponsabile: string;

  @Input()
  set procedimentoSelezionato(procedimento: any) {
    this.iterParams = new IterParams();
    this.iterParams.dataCreazioneIter = new Date();
    this.buildProcedimento(procedimento);
    this.avviaIterDaDocumento = false;
  }

  @Input()
  set procedimentoSelezionatoDaDocumento(procedimento: any) {
    this.buildProcedimento(procedimento);
    this.avviaIterDaDocumento = true;
  }

  @Input()
  set documentoSelezionato(doc: any) {
    this.iterParams = new IterParams();
    this.iterParams.codiceRegistroDocumento = doc.registro;
    this.iterParams.numeroDocumento = doc.numero;
    this.iterParams.annoDocumento = doc.anno;
    this.iterParams.oggettoIter = doc.oggetto;
    this.iterParams.dataAvvioIter = new Date(doc.dataRegistrazione);
    this.iterParams.dataCreazioneIter = new Date();
    this.iterParams.promotoreIter = doc.promotore;
  }

  @Output("messageEvent") messageEvent = new EventEmitter<any>();

  constructor(private odataContextFactory: OdataContextFactory, private http: HttpClient, private globalContextService: GlobalContextService) {
    console.log("avvia-nuovo-iter (constructor)");
    this.odataContextDefinitionFunctionImport = this.odataContextFactory.buildOdataFunctionsImportDefinition();
    this.getInfoSessionStorage();
    this.setUtenteResponsabile = this.setUtenteResponsabile.bind(this);
  }

  private getInfoSessionStorage(): void {
    this.loggedUser = this.globalContextService.getInnerSharedObject("loggedUser");
  }

  private buildProcedimento(procedimento: any): void {
    if (procedimento != null) {
      this.nomeProcedimento = procedimento.procedimento.idAziendaTipoProcedimento.idTipoProcedimento.nome
        + " (" + procedimento.procedimento.idStruttura.nome + ")";
      this.iterParams.idProcedimento = procedimento.procedimento.id;
      this.iterParams.procedimento = procedimento.procedimento;
      this.buildDataSourceUtenti(procedimento.procedimento.idStruttura.id);
    }
  }

  private buildDataSourceUtenti(idStruttura: number): void {
    this.dataSourceUtenti = new DataSource({
      store: this.odataContextDefinitionFunctionImport.getContext()[new GetUtentiGerarchiaStruttura().getName()]
      .on("loading", (loadOptions) => {
        console.log("on loading");
        if (loadOptions.filter && loadOptions.filter[0]) {
          loadOptions.customQueryParams.searchString = loadOptions.filter[0][2] /* ? loadOptions.filter[0][2] : "" */;
        } else {
          loadOptions.customQueryParams.searchString = "";
        }
      }),
      customQueryParams: {
        idStruttura: idStruttura,
        searchString: this.searchString ? this.searchString : ""
      },
      expand: [
        "idUtente/idPersona",
        "idStruttura",
        "idAfferenzaStruttura"
      ]
    });

    this.dataSourceUtenti.load().then(res => {
      console.log("after load");
      for (let e of res) {
        if (e.idUtente.id === this.iterParams.idUtenteLoggato && e.idStruttura.id === this.iterParams.procedimento.idStruttura.id) {
          this.idUtenteDefault = e.id;
          this.iterParams.idUtenteResponsabile = this.iterParams.idUtenteLoggato;
          this.descrizioneUtenteResponsabile = e.idUtente.idPersona.descrizione 
            + " (" + e.idStruttura.nome
            + " - " + e.idAfferenzaStruttura.descrizione + ")";
          break;
        }
      }
    });
  }

  private campiObbligatoriCompilati(): boolean {
    if (this.iterParams.idProcedimento == null) {
      this.showStatusOperation("Per avviare un nuovo iter devi selezionare un procedimento", "warning");
      return false;
    }

    if (this.iterParams.dataAvvioIter == null || this.iterParams.oggettoIter == null || this.iterParams.oggettoIter === "" ||
      this.iterParams.numeroDocumento == null || this.iterParams.annoDocumento == null || this.iterParams.codiceRegistroDocumento == null ||
      this.iterParams.codiceRegistroDocumento === "") {
      this.showStatusOperation("Per avviare un nuovo iter tutti i campi sono obbligatori", "warning");
      return false;
    }
    return true;
  }

  private avviaIter(): void {
    const req = this.http.post(CUSTOM_RESOURCES_BASE_URL + "iter/avviaNuovoIter", this.iterParams, { headers: new HttpHeaders().set("content-type", "application/json") }) // Object.assign({}, this.iterParams))
      .subscribe(
        res => {
          if (this.avviaIterDaDocumento) {
            this.riepilogaAndChiudi(res);
          } else {
            let idIter = +res["idIter"];
            this.closePopUp(idIter);
          }
        },
        err => {
          this.showStatusOperation("L'avvio del nuovo iter è fallito. Contattare Babelcare", "error");
        }
      );
  }

  private showStatusOperation(message: string, type: string): void {
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

  private formatDateToString(date: Date): string {
    let dd = date.getDate(); 
    let mm = date.getMonth() + 1; 
    let yyyy = date.getFullYear();
    let dds, mms;
    if (dd < 10) dds = "0" + dd;
    if (mm < 10) mms = "0" + mm; 
    return dds + "/" + mms + "/" + yyyy;
  }

  private riepilogaAndChiudi(res): void {
    let text = "Torna a";
    switch (this.iterParams.codiceRegistroDocumento) {
      case "PG": 
        text += " Pico";
        break;
      case "DETE":
        text += " Dete";
        break;
      case "DELI":
        text += " Deli";
        break;
      default:
        text += "lla Home";
        break;
    }
    custom({
      title: "Iter avviato con successo", 
      message: this.buildMessaggioRiepilogativo(res), 
      buttons: [{
        type: "success",
        text: text,
        icon: "back",
        onClick: () => {
          window.close();
        }
      }]
    }).show();
  }

  private buildMessaggioRiepilogativo(res: any): string {
    return "<b>E' stato creato l'iter numero:</b> " + res["idIter"]
      + "<br><b>Tramite il documento:</b> " + this.iterParams.codiceRegistroDocumento + " " + this.iterParams.numeroDocumento + "/" + this.iterParams.annoDocumento
      + "<br><b>Responsabilie procedimento amministrativo:</b> " + this.descrizioneUtenteResponsabile
      + "<br><b>Data avvio iter:</b> " + this.formatDateToString(this.iterParams.dataAvvioIter)
      + "<br><b>Data massima conclusione:</b> " + this.formatDateToString(this.dataMassimaConclusione)
      + "<br><b>Promotore:</b> " + this.iterParams.promotoreIter
      + "<br><b>Oggetto:</b> " + this.iterParams.oggettoIter;
  }

  ngOnInit() {
    this.iterParams.idUtenteLoggato = this.loggedUser.getField(bUtente.id);
  }

  public handleEvent(name: string, data: any): void {
    switch (name) {
      case "onClickProcedi":
        if (this.campiObbligatoriCompilati()) {
          this.askConfirmAndExecute("Avvio iter", "Stai avviando un nuovo iter, confermi?", this.avviaIter.bind(this));
        }
        break;
      case "onClickAnnulla":
        if (this.avviaIterDaDocumento) {
          this.askConfirmAndExecute("Chiudi", "Stai annullando l'avvio dell'iter, confermi?", window.close);
        } else {
          this.closePopUp();
        }
        break;
    }
  }

  public askConfirmAndExecute(title: string, text: string, exe: any): void {
    confirm(text, title).then(dialogResult => {
      if (dialogResult) {
        exe();
      }
    });
  }

  public closePopUp(idIter?: number): void {
    this.messageEvent.emit({ visible: false, idIter: idIter });
  }

  public setDataMax(): Date {
    if (this.iterParams.procedimento != null && this.iterParams.dataAvvioIter !== undefined) {
      this.dataMassimaConclusione = new Date();
      this.dataMassimaConclusione.setDate(this.iterParams.dataAvvioIter.getDate() + this.iterParams.procedimento.idAziendaTipoProcedimento.durataMassimaProcedimento);
    }
    return this.dataMassimaConclusione;
  }

  public getDescrizioneUtente(item: any): string {
    return item ? item.idUtente.idPersona.descrizione 
        + " (" + item.idStruttura.nome
        + " - " + item.idAfferenzaStruttura.descrizione + ")" : null;
  }

  public setUtenteResponsabile(item: any): void {
    this.iterParams.idUtenteResponsabile = item ? item.itemData.idUtente.id : null;
    this.idUtenteDefault = item ? item.itemData.id : null;
    this.descrizioneUtenteResponsabile = item ? item.itemData.idUtente.idPersona.descrizione 
      + " (" + item.itemData.idStruttura.nome
      + " - " + item.itemData.idAfferenzaStruttura.descrizione + ")" : null;
  }
}

class IterParams {
  public idUtenteResponsabile: number;
  public idUtenteStrutturaResponsabile: number;
  public idUtenteLoggato: number;
  public idProcedimento: number;
  public oggettoIter: string;
  public dataCreazioneIter: Date;
  public dataAvvioIter: Date;
  public codiceRegistroDocumento: string;
  public numeroDocumento: string;
  public annoDocumento: number;
  public promotoreIter: string;
  public procedimento: Procedimento;
}