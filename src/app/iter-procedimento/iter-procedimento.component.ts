import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import DataSource from "devextreme/data/data_source";
import { OdataContextDefinition, CustomLoadingFilterParams, OdataContextFactory, ButtonAppearance, GlobalContextService, Entity } from "@bds/nt-context";
import { CUSTOM_RESOURCES_BASE_URL } from "environments/app.constants";
import { Iter, Utente, Fase, FaseIter, ProcedimentoCache, bUtente, bAzienda, Titolo } from "@bds/nt-entities";
import { CambioDiStatoParams } from "../classi/condivise/sospensione/gestione-stato-params";
import { HttpClient } from "@angular/common/http";
import notify from "devextreme/ui/notify";
import { ActivatedRoute, Params, Resolve } from "@angular/router";
import { AfterViewInit } from "@angular/core/src/metadata/lifecycle_hooks";
import * as moment from "moment";
import { CambioDiStatoBoxComponent } from "../cambio-di-stato-box/cambio-di-stato-box.component";
import { LoggedUser } from "@bds/nt-login";
import { Observable, Subscription } from "rxjs";
import { HttpHeaders } from "@angular/common/http";
import {  STATI } from "@bds/nt-entities";



@Component({
  selector: "app-iter-procedimento",
  templateUrl: "./iter-procedimento.component.html",
  styleUrls: ["./iter-procedimento.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class IterProcedimentoComponent implements OnInit, AfterViewInit {
  
  private subscriptions: Subscription[] = [];

  public iter: Iter = new Iter();
  public idIterArray: Object;
  public procedimentoCache = new ProcedimentoCache;
  public dataSourceIter: DataSource;
  public durataPrevista: number;
  public idIter: number;

  public popupVisible: boolean = false;
  public passaggioDiFaseVisible: boolean = false;
  public sospensioneIterVisible: boolean = false;
  public genericButtons: ButtonAppearance[];


  // pulsanti custom aggiunti alla button bar
  public procediButton: ButtonAppearance;
  public sospendiButton: ButtonAppearance;

  public datiGenerali = "";
  // Dati che verranno ricevuti dall'interfaccia chiamante
  public infoGeneriche: any = {
    struttura: "",
    tipoProcedimento: "",
  };
  public popupData: any = {
    visible: false,
    title: "titolo",
    field: "nome campo",
    fieldValue: "valore"
  };
  public perFigliParteDestra: Object;

  public perFiglioPassaggioFase: Object;

  public paramsPerSospensione: Object;
  public sospensioneParams: CambioDiStatoParams = new CambioDiStatoParams();
  public loggedUser$: Observable<LoggedUser>;
  public userInfo: UserInfo;
  public iodaPermission: boolean;
  public hasPermissionOnFascicolo: boolean = false;
  // public soloEditing: boolean = false;


  public dataSourceClassificazione: DataSource;

  constructor(
    private odataContextFactory: OdataContextFactory,
    private http: HttpClient, private activatedRoute: ActivatedRoute,
    private globalContextService: GlobalContextService
  ) {

    console.log("iter-procedimento-component (constructor)");
    this.activatedRoute.queryParams.subscribe((queryParams: Params) => {
      const idIter: string = queryParams["idIter"];
      if (idIter) {
        this.idIter = +idIter;
      }
    });

    const oataContextDefinitionTitolo: OdataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
    const customLoadingFilterParams: CustomLoadingFilterParams = new CustomLoadingFilterParams();
    customLoadingFilterParams.addFilter("nomeTitolo", ["tolower(${target})", "contains", "${value.tolower}"]);

    this.dataSourceIter = new DataSource({
      store: oataContextDefinitionTitolo.getContext()[new Iter().getName()],
      expand: [
        "idTitolo",
        "idFaseCorrente",
        "idStato",
        "idIterPrecedente",
        "idResponsabileProcedimento.idPersona",
        "idResponsabileAdozioneProcedimentoFinale.idPersona",
        "procedimentoCache.idTitolarePotereSostitutivo.idPersona",
        "procedimentoCache.idStrutturaTitolarePotereSostitutivo",
        "procedimentoCache.idResponsabileAdozioneAttoFinale.idPersona",
        "procedimentoCache.idStrutturaResponsabileAdozioneAttoFinale",
        "procedimentoCache.idResponsabileProcedimento.idPersona",        
        "procedimentoCache.idStrutturaResponsabileProcedimento",        
        "procedimentoCache.idStruttura"
      ],
      filter: [["id", "=", this.idIter]],
      map: (item) => {
        if (item) {
          if (item.procedimentoCache.idTitolarePotereSostitutivo && item.procedimentoCache.idStrutturaTitolarePotereSostitutivo) {
            item.procedimentoCache.nomeVisualTitolare = item.procedimentoCache.idTitolarePotereSostitutivo.idPersona.descrizione +
              " (" + item.procedimentoCache.idStrutturaTitolarePotereSostitutivo.nome + ")";
          }
          if (item.procedimentoCache.idResponsabileAdozioneAttoFinale && item.procedimentoCache.idStrutturaResponsabileAdozioneAttoFinale) {
            item.procedimentoCache.nomeVisualResponsabileAttoFinale = item.procedimentoCache.idResponsabileAdozioneAttoFinale.idPersona.descrizione +
              " (" + item.procedimentoCache.idStrutturaResponsabileAdozioneAttoFinale.nome + ")";
          }
          if (item.procedimentoCache.idResponsabileProcedimento && item.procedimentoCache.idStrutturaResponsabileProcedimento) {
            item.procedimentoCache.nomeVisualResponsabileProcedimento = item.procedimentoCache.idResponsabileProcedimento.idPersona.descrizione +
              " (" + item.procedimentoCache.idStrutturaResponsabileProcedimento.nome + ")";
          }
          return item;
        }
      }
    });
    this.buildIter();

    this.perFigliParteDestra = {
      idIter: this.idIter,
      ricarica: false  // ricarica è un flag, se modificato ricarica (ngOnChange). Non importa il valore
    };
    this.recuperaUserInfo();

    this.dataSourceClassificazione = new DataSource({
      store: oataContextDefinitionTitolo.getContext()[new Titolo().getName()],
      filter: [["idAzienda", "=", this.userInfo.idAzienda]] // questo non so se ci vuole in realtà, la classificazione non è sceglibile
    });
  }

  ngAfterViewInit() {}

  recuperaUserInfo() {
    this.loggedUser$ = this.globalContextService.getSubjectInnerSharedObject("loggedUser");
    this.subscriptions.push(
      this.loggedUser$.subscribe(
        (loggedUser: LoggedUser) => {
          if (loggedUser) {
            this.userInfo = {
              idUtente: loggedUser.getField(bUtente.id),
              idAzienda: loggedUser.getField(bUtente.aziendaLogin)[bAzienda.id],
              cf: loggedUser.getField(bUtente.codiceFiscale)
            };
          }
        }
      )
    );
  }

  ngOnInit() { }

  public buildTitoloDatiGenerali() {
    this.datiGenerali = "Iter n." + this.iter.numero + "/" + this.iter.anno + " (" + this.iter.idStato.descrizione + ")";
  }

  isSospeso() {
    if (this.iter.idStato.codice === STATI.SOSPESO) // 2 --> SOSPESO
      return true;
    else
      return false;
  }

  setNomeBottoneSospensione() {
    this.sospendiButton.label = this.getNomeBottoneSospensione();
  }

  getNomeBottoneSospensione() {
    if (this.isSospeso())
      return "Termina Sospensione";
    else
      return "Sospendi";
  }

  disableProcedi() {
    return this.hasPermissionOnFascicolo !== true || this.isSospeso() || this.iter.idFaseCorrente.faseDiChiusura || this.iter.idStato.codice === STATI.CHIUSO;
  }

  disableSospendi() {
    return this.hasPermissionOnFascicolo !== true || this.iter.idFaseCorrente.faseDiChiusura || this.iter.idStato.codice === STATI.CHIUSO;
  }

  inSolaLettura() {
    return this.hasPermissionOnFascicolo !== true || this.iter.idFaseCorrente.faseDiChiusura || this.iter.idStato.codice === STATI.CHIUSO;
  }

  /* 
  Non cancellare, potrebbe tornare utile in futuro
  generateCustomButtons() {
    this.genericButtons = new Array<ButtonAppearance>();
    this.procediButton = new ButtonAppearance("Procedi", "", false, this.disableProcedi());
    this.sospendiButton = new ButtonAppearance("Gestisci stato", "", false, this.disableSospendi());
    this.setNomeBottoneSospensione();
    this.genericButtons.push(this.procediButton, this.sospendiButton);
    this.soloEditing = this.disableSospendi();
  } */

  buildIter() {
    this.dataSourceIter.load().then(res => {
      this.iter.build(res[0]);
      // this.generateCustomButtons(); Non cancellare, potrebbe tornare utile in futuro
      this.calculateIodaPermissionAndSetButton();
      this.iter.dataChiusuraPrevista = new Date(this.iter.dataAvvio.getTime());
      this.iter.dataChiusuraPrevista.setDate(this.iter.dataChiusuraPrevista.getDate() + this.iter.procedimentoCache.durataMassimaProcedimento);
      this.buildTitoloDatiGenerali();

      this.setParametriSospensione();
      this.infoGeneriche.struttura = this.iter.procedimentoCache.idStruttura.nome;
      this.infoGeneriche.tipoProcedimento = this.iter.procedimentoCache.nomeTipoProcedimento;
    });
  }

  updateNoteControInteressati() {
    this.popupData.title = "Note controinteressati";
    this.popupData.field = "noteControInteressati";
    this.popupData.fieldValue = this.iter.noteControinteressati;
    this.popupData.visible = true;
  }

  updateEsitoMotivazione() {
    this.popupData.title = "Esito motivazione";
    this.popupData.field = "esitoMotivazione";
    this.popupData.fieldValue = this.iter.esitoMotivazione;
    this.popupData.visible = true;
  }

  updateIter() {
    let doUpdate: boolean = false;
    if (this.popupData.field === "esitoMotivazione") {
      if (this.iter.esitoMotivazione !== this.popupData.fieldValue) {
        this.iter.esitoMotivazione = this.popupData.fieldValue;
        doUpdate = true;
      }
    } else {
      if (this.iter.noteControinteressati !== this.popupData.fieldValue) {
        this.iter.noteControinteressati = this.popupData.fieldValue;
        doUpdate = true;
      }
    }
    if (doUpdate) {
      let iterClonato = Entity.cloneObject(this.iter);
      this.dataSourceIter.store().update(this.iter.id, iterClonato);
    }
    this.closePopupNote();
  }

  closePopupNote() {
    this.popupData.title = "";
    this.popupData.field = "";
    this.popupData.fieldValue = "";
    this.popupData.visible = false;
  }

  public passaggioDiFase() {
    const req = this.http.get(CUSTOM_RESOURCES_BASE_URL + "iter/getProcessStatus" + "?idIter=" + this.idIter)
      .subscribe(
        res => {
          let current = JSON.parse(res["currentFase"]);
          let next = JSON.parse(res["nextFase"]);

          this.perFiglioPassaggioFase = {
            idIter: this.idIter,
            currentFaseName: current.nomeFase,
            nextFaseName: next.nomeFase,
            isNextFaseDiChiusura: next.faseDiChiusura
          };

          this.popupData.title = "Passaggio Di Fase";
          this.passaggioDiFaseVisible = true;
        },
        err => {
          notify("Non esiste la fase successiva", "error", 1000);
        });
  }

  public setParametriSospensione() {
    this.paramsPerSospensione = {
      iter: this.iter,
      stato: this.iter.idStato,
      dataSospensione: this.iter.idStato.codice === STATI.SOSPESO ? this.getDataUltimaSospensione() : null
    };
  }

  public sospensioneIter() {
    this.sospensioneParams = new CambioDiStatoParams();
    this.sospensioneParams.idIter = this.idIter;
    this.sospensioneParams.numeroIter = this.iter.numero;
    this.sospensioneParams.annoIter = this.iter.anno;
    this.sospensioneParams.codiceStatoCorrente = this.iter.idStato.codice;
    this.popupData.title = "Cambia stato iter";
    this.sospensioneIterVisible = true;
  }

  receiveMessage($event) {
    this.passaggioDiFaseVisible = $event["visible"];
    if ($event["proceduto"]) {
      let perFigliNew: Object = { idIter: this.idIter, cambiato: !this.perFigliParteDestra["ricarica"] };
      this.perFigliParteDestra = perFigliNew;
      this.buildIter();
    }
  }

  receiveMessageFromSospensione($event) {
    console.log("Evento emesso da sospenisone: ", $event);
    this.sospensioneIterVisible = $event["visible"];
    let perFigliNew: Object = { idIter: this.idIter, cambiato: !this.perFigliParteDestra["ricarica"] };
    this.perFigliParteDestra = perFigliNew;
    this.buildIter();
  }

  /* 
  Non cancellare. Potrebbe tornare utile in futuro
  onGenericButtonClick(buttonName: string) {
    switch (buttonName) {
      case "Termina Sospensione":
      case "Sospendi":
        this.sospensioneIter();
        break;

      case "Procedi":
        this.passaggioDiFase();
        break;
    }
  } */

  getDataUltimaSospensione() {
    let date;
    const req = this.http.get(CUSTOM_RESOURCES_BASE_URL + "iter/getUltimaSospensione" + "?idIter=" + this.iter.id)
      .subscribe(
        res => {
          let r: any = res;
          date = moment(r.dataSospensione);
          return date;
        },
        err => {
          // this.showStatusOperation("L'avvio del nuovo iter è fallito. Contattare Babelcare", "error");
        }
      );
  }

  isIterFinito() {
    let b: boolean;
    const req = this.http.get(CUSTOM_RESOURCES_BASE_URL + "iter/getProcessStatus" + "?idIter=" + this.iter.id)
      .subscribe(
        res => {
          let next = JSON.parse(res["nextFase"]);
          if (next != null)
            b = false;
          else
            b = true;
        },
        err => {
          b = true;
        });
    return b;
  }

  public calculateIodaPermissionAndSetButton() {
    let x;
    if (this.iter.idFascicolo) {
      let data = new Map<String, Object>();
      data.set("numerazioneGerarchica", this.iter.idFascicolo);
      const req = this.http.post(CUSTOM_RESOURCES_BASE_URL + "iter/hasPermissionOnFascicolo", this.iter.idFascicolo, { headers: new HttpHeaders().set("content-type", "application/json") })
        .subscribe(
          res => {
            this.hasPermissionOnFascicolo = res["hasPermission"] === "true";
            // this.generateCustomButtons(); // ora che ho i permessi mi posso creare i bottoni
          },
          err => {
            // this.generateCustomButtons();
          }
        );
    }
  }

  customDisplayExprClassificazione(data: Titolo) {
    let displayExpression: string = "";
    if (data) {
      displayExpression = "[" + data.classificazione + "] " + data.nome;
    }
    return displayExpression;
  }

}

interface UserInfo {
  idUtente: number;
  cf: string;
  idAzienda: number;
}