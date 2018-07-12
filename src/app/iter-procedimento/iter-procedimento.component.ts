import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import DataSource from "devextreme/data/data_source";
import { OdataContextDefinition, CustomLoadingFilterParams, OdataContextFactory, ButtonAppearance, GlobalContextService, Entity, OdataUtilities } from "@bds/nt-context";
import { CUSTOM_RESOURCES_BASE_URL, TOAST_WIDTH, TOAST_POSITION, ESITI } from "environments/app.constants";
import { Iter, Utente, ProcedimentoCache, bUtente, bAzienda, Titolo, RegistroTipoProcedimento, UtenteStruttura, GetUtentiGerarchiaStruttura } from "@bds/nt-entities";
import { HttpClient } from "@angular/common/http";
import notify from "devextreme/ui/notify";
import { ActivatedRoute, Params } from "@angular/router";
import { AfterViewInit } from "@angular/core/src/metadata/lifecycle_hooks";
import { LoggedUser } from "@bds/nt-login";
import { Observable, Subscription } from "rxjs";
import { HttpHeaders } from "@angular/common/http";
import { STATI } from "@bds/nt-entities";
import { DxFormComponent } from "devextreme-angular";
import { IterProcedimentoFascicoloUtilsClass, PERMESSI } from "./iter-procedimento-fascicolo-utils.class";

@Component({
  selector: "app-iter-procedimento",
  templateUrl: "./iter-procedimento.component.html",
  styleUrls: ["./iter-procedimento.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class IterProcedimentoComponent implements OnInit, AfterViewInit {

  private subscriptions: Subscription[] = [];
  private initialWidth: number = window.innerWidth;
  private threshold: number = 1500;
  // private previousWidth: number = this.initialWidth;
  private odataContextDefinitionFunctionImport: OdataContextDefinition;
  private odataContextDefinition: OdataContextDefinition;
  
  public iter: Iter = new Iter();
  public idIterArray: Object;
  public procedimentoCache = new ProcedimentoCache;
  public dataSourceIter: DataSource;
  public durataPrevista: number;
  public idIter: number;

  public popupVisible: boolean = false;
  public passaggioDiFaseVisible: boolean = false;
  // public sospensioneIterVisible: boolean = false;
  public genericButtons: ButtonAppearance[];
  public classeDiHighlight = "";
  public pubblicazioneAllAlbo: boolean = false;
  public popupRiattivaIterVisibile: boolean = false;
  public datiRiattivazioneIter: any = { note: "", idIter: null };
  public nuovoUtenteResponsabile: Utente;

  public popupVicariVisibile: boolean = false;
  public dataSourceVicari: DataSource;

  public fascicoloIter: any;
  public permessoUtenteLoggato: number;

  @ViewChild("myForm1") myForm1: DxFormComponent;


  // pulsanti custom aggiunti alla button bar
  // public procediButton: ButtonAppearance;
  // public sospendiButton: ButtonAppearance;
  public riattivaButton: ButtonAppearance;

  public datiGenerali = "";
  // Dati che verranno ricevuti dall'interfaccia chiamante
  public infoGeneriche: any = {
    struttura: "",
    tipoProcedimento: "",
  };
  public popupData: any = {
    visible: false,
    title: "",
    field: "",
    fieldValue: "",
    checkInteressati: false
  };
  public popupDatiTemporali: any = {
    visible: false,
    title: "",
    fieldDays: 0,
    fieldMotivation: "",
    label: "",
    action: ""
  };
  
  public popupCambioResp: any = {
    visible: false,
    title: "",
    respAttuale: ""
  };
  public perFigliParteDestra: Object;

  public perFiglioPassaggioFase: Object;

  // public paramsPerSospensione: Object;
  // public sospensioneParams: CambioDiStatoParams = new CambioDiStatoParams();
  public loggedUser$: Observable<LoggedUser>;
  public userInfo: UserInfo;
  public iodaPermission: boolean;
  // public hasPermissionOnFascicolo: boolean = false;
  public colCountGroup: number;

  
  // public soloEditing: boolean = false;

  public dataSourceUtenti: DataSource;
  public dataSourceUtenteLoggato: DataSource;
  public dataSourceClassificazione: DataSource;
  public idUtenteDefault: number;
  public newIdRespDefault = "";
  public descrizioneUtenteResponsabile: string;
  public arrayEsiti: any[] = Object.keys(ESITI).map(key => ({ "codice": key, "descrizione": ESITI[key] }));

  

  constructor(
    private odataContextFactory: OdataContextFactory,
    private http: HttpClient, private activatedRoute: ActivatedRoute,
    private globalContextService: GlobalContextService,
    private odataUtilities: OdataUtilities
  ) {

    // gestione resize window (pessime prestazioni)
   /*  this.screen = this.screen.bind(this); */

    console.log("iter-procedimento-component (constructor)");
    this.activatedRoute.queryParams.subscribe((queryParams: Params) => {
      const idIter: string = queryParams["idIter"];
      if (idIter) {
        this.idIter = +idIter;
      }
    });

    this.odataContextDefinitionFunctionImport = this.odataContextFactory.buildOdataFunctionsImportDefinition();
    this.odataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
    
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
        "procedimentoCache.idStruttura",
        "idProcedimento.idAziendaTipoProcedimento.idTipoProcedimento"
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

          this.calcolaSePubblicabileAllAlboAndSetClasseCss(item.idProcedimento.idAziendaTipoProcedimento.idTipoProcedimento.id);

          return item;
        }
      }
    });
    this.buildIter();

    this.perFigliParteDestra = {
      idIter: this.idIter,
      ricarica: false,  // ricarica è un flag, se modificato ricarica (ngOnChange). Non importa il valore
      classeCSS: this.classeDiHighlight
    };
    this.recuperaUserInfo();

    this.dataSourceClassificazione = new DataSource({
      store: oataContextDefinitionTitolo.getContext()[new Titolo().getName()],
      filter: [["idAzienda", "=", this.userInfo.idAzienda]] // questo non so se ci vuole in realtà, la classificazione non è sceglibile
    });

    if (this.initialWidth >= this.threshold) {
      this.colCountGroup = 5;
    }
    else {
      this.colCountGroup = 10;
    }
  }

   private buildDataSourceUtenti(): void {
    /*
      Il caricamento del datasource per la lookup ha un problema. E' paginato. 
      Se l'utente loggato, che deve essere impostato come utente default, non è presente nella prima tranche di dati
      che il datasource tira su, allora non si riuscirà ad impostare l'utente default.
      Il workaraound consiste nel caricare l'utente loggato ed aggiungerlo qualora non fosse già presente.
    */
    this.dataSourceUtenti = new DataSource({
      store: this.odataContextDefinitionFunctionImport.getContext()[new GetUtentiGerarchiaStruttura().getName()]
      .on("loading", (loadOptions) => {
        this.odataUtilities.filterToCustomQueryParams(["searchString"], loadOptions);
      }),
      customQueryParams: {
        // searchString: ""
      },
      expand: [
        "idUtente/idPersona",
        "idStruttura",
        "idAfferenzaStruttura"
      ]
    });

    this.dataSourceUtenteLoggato = new DataSource({
      store: this.odataContextDefinition.getContext()[new UtenteStruttura().getName()],
      expand: [
        "idUtente.idPersona", 
        "idStruttura", 
        "idAfferenzaStruttura"
      ],
      filter: [
        ["idUtente.id", "=", this.userInfo.idUtente]
      ]
    });

    // Ora faccio le load dell'utente loggato, e quando ce l'ho faccio la load del datasource.
    // A quel punto a seconda che ci sia o meno aggiungo l'utente loggato al datasource
    this.dataSourceUtenteLoggato.load().then(re => {
      let usLogged = re[0];
      this.dataSourceUtenti.load().then(res => {
        let ciSonoGià = false;
        for (let e of res) {
          if (e.idUtente.id === this.userInfo.idUtente && e.idStruttura.id === this.iter.idProcedimento.idStruttura.id) {
            ciSonoGià = true;
            break;
          }
        }
        if (!ciSonoGià) {
          res.push(usLogged);
        }
        this.idUtenteDefault = re[0].id;
        this.descrizioneUtenteResponsabile = re[0].idUtente.idPersona.descrizione 
          + " (" + re[0].idStruttura.nome
          + " - " + re[0].idAfferenzaStruttura.descrizione + ")";
      });
    });
   }
  public getDescrizioneUtente(item: any): string {
    return item ? item.idUtente.idPersona.descrizione 
        + " (" + item.idStruttura.nome
        + " - " + item.idAfferenzaStruttura.descrizione + ")" : null;
  }

  onValueChanged(e: any) {
    console.log("ACCIDENTI = ", e);
    this.nuovoUtenteResponsabile = e.value.idUtente;
    this.newIdRespDefault = e.value;
    console.log("UTENTE = ", this.nuovoUtenteResponsabile);
  }

// gestione resize window (pessime prestazioni)
/*   public screen(width) {
    console.log("Screen", width);
    console.log("Previous width", this.previousWidth);
    if (this.myForm1 && this.myForm1.instance) {
      if (width >= this.threshold && this.previousWidth < this.threshold) {
        this.colCountGroup = 5;
        console.log("superata soglia", width, this.myForm1);
        this.previousWidth = width;
        this.myForm1.instance.repaint();
      } else if (width <= this.threshold && this.previousWidth > this.threshold) {

        this.colCountGroup = 10;
        console.log("andati sotto soglia", width, this.previousWidth);
        this.previousWidth = width;
        this.myForm1.instance.repaint();
      } else {
        this.previousWidth = width;
      }
    }
  } */

  ngAfterViewInit() { }

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

  /* setNomeBottoneSospensione() {
    this.sospendiButton.label = this.getNomeBottoneSospensione();
  }

  getNomeBottoneSospensione() {
    if (this.isSospeso())
      return "Termina Sospensione";
    else
      return "Sospendi";
  } */

  disableProcedi() {
    return (this.permessoUtenteLoggato >= +PERMESSI.MODIFICA) !== true || this.isSospeso() || this.iter.idFaseCorrente.faseDiChiusura || this.iter.idStato.codice === STATI.CHIUSO;
  }

  disableSospendi() {
    return (this.permessoUtenteLoggato >= +PERMESSI.MODIFICA) !== true || this.iter.idFaseCorrente.faseDiChiusura || this.iter.idStato.codice === STATI.CHIUSO;
  }

  inSolaLettura() {
    return (this.permessoUtenteLoggato >= +PERMESSI.MODIFICA) !== true || this.iter.idFaseCorrente.faseDiChiusura || this.iter.idStato.codice === STATI.CHIUSO;
  }

  disableAreaTextNote() {
    return this.inSolaLettura() || !this.popupData.checkInteressati;
  }

  
  generateCustomButtons() {
    
    // this.procediButton = new ButtonAppearance("Procedi", "", false, this.disableProcedi());
    // this.sospendiButton = new ButtonAppearance("Gestisci stato", "", false, this.disableSospendi());
    if (this.isSospeso()) {
      this.genericButtons = new Array<ButtonAppearance>();
      this.riattivaButton = new ButtonAppearance("Riattiva Iter", "", false, false);
      this.genericButtons.push(this.riattivaButton);
    }
    // this.setNomeBottoneSospensione();
    
    // this.soloEditing = this.disableSospendi();
  }

  buildIter() {
    this.dataSourceIter.load().then(res => {
      this.iter.build(res[0]);
      // this.generateCustomButtons(); Non cancellare, potrebbe tornare utile in futuro
      this.calculateIodaPermissionAndSetButton();
      this.updateDataChiusuraPrevista();
      this.buildTitoloDatiGenerali();
      // this.setParametriSospensione();
      this.infoGeneriche.struttura = this.iter.procedimentoCache.idStruttura.nome;
      this.infoGeneriche.tipoProcedimento = this.iter.procedimentoCache.nomeTipoProcedimento;

      let oggi = new Date();
      let utc1 = Date.UTC(oggi.getFullYear(), oggi.getMonth(), oggi.getDate());
      let utc2 = Date.UTC(this.iter.dataAvvio.getFullYear(), this.iter.dataAvvio.getMonth(), this.iter.dataAvvio.getDate());
      this.iter.giorniDurataTrascorsi = Math.abs(Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24)));
    });
  }

  updateDataChiusuraPrevista() {
    this.iter.dataChiusuraPrevista = new Date(this.iter.dataAvvio.getTime());
    let giorniAllaChiusura = 0;
    if (this.iter.procedimentoCache.durataMassimaProcedimento) {
      giorniAllaChiusura += this.iter.procedimentoCache.durataMassimaProcedimento;
    }
    if (this.iter.derogaDurata) {
      giorniAllaChiusura += this.iter.derogaDurata;
    }
    if (this.iter.giorniSospensioneTrascorsi) {
      giorniAllaChiusura += this.iter.giorniSospensioneTrascorsi;
    }
    this.iter.dataChiusuraPrevista.setDate(this.iter.dataChiusuraPrevista.getDate() + giorniAllaChiusura);
  }

  updateNoteControInteressati() {
    this.popupData.title = "Note controinteressati";
    this.popupData.field = "noteControInteressati";
    this.popupData.fieldValue = this.iter.noteControinteressati;
    this.popupData.checkInteressati = this.iter.presenzaControinteressati;
    this.popupData.visible = true;
  }

  updateEsitoMotivazione() {
    this.popupData.title = "Esito motivazione";
    this.popupData.field = "esitoMotivazione";
    this.popupData.fieldValue = this.iter.esitoMotivazione;
    this.popupData.visible = true;
  }

  updateMotivazioneDeroga() {
    this.popupDatiTemporali = {
      visible: true,
      title: "Modifica deroga durata",
      fieldDays: this.iter.derogaDurata,
      fieldMotivation: this.iter.motivoDerogaDurata,
      label: "Deroga durata (gg)",
      action: "durata"
    };
  }

  updateMotivazioneSospensione() {
    this.popupDatiTemporali = {
      visible: true,
      title: "Modifica proroga sospensione",
      fieldDays: this.iter.derogaSospensione,
      fieldMotivation: this.iter.motivoDerogaSospensione,
      label: "Proroga sospensione (gg)",
      action: "sospensione"
    };
  }

  updateIter(validationParams: any) {
    let doUpdate: boolean = false;
    if (this.popupData.field) {
      if (this.popupData.field === "esitoMotivazione") {
        if (this.iter.esitoMotivazione !== this.popupData.fieldValue) {
          this.iter.esitoMotivazione = this.popupData.fieldValue;
          doUpdate = true;
        }
      } else {
        if (this.iter.noteControinteressati !== this.popupData.fieldValue || this.iter.presenzaControinteressati !== this.popupData.checkInteressati) {
          this.iter.noteControinteressati = this.popupData.fieldValue;
          this.iter.presenzaControinteressati = this.popupData.checkInteressati;
          doUpdate = true;
        }
      }
    } else if (this.popupDatiTemporali.action) {
      // Adottata questa soluzione punk perchè l'isValid ritornava false la seconda volta anche se tutti i capi sono compilati
      let b = (this.popupDatiTemporali.fieldDays !== undefined && this.popupDatiTemporali.fieldDays >= 0 && this.popupDatiTemporali.fieldMotivation);

      // Questa sozzeria serve perché se l'utente cambia vari iter e apre questo form i validatori si sommano invece di resettarsi.
      if (validationParams.validationGroup.validators.length > 2) {
        let arrayTemp = [validationParams.validationGroup.validators.pop()];
        arrayTemp.push(validationParams.validationGroup.validators.pop());
        validationParams.validationGroup.validators = arrayTemp;
      }

      const validator = validationParams.validationGroup.validate();

      if (this.popupDatiTemporali.action === "durata") {
        if (validator.isValid) {
          this.iter.derogaDurata = this.popupDatiTemporali.fieldDays;
          this.iter.motivoDerogaDurata = this.popupDatiTemporali.fieldMotivation;
          doUpdate = true;
        }else if (this.iter.derogaDurata === this.popupDatiTemporali.fieldDays && this.iter.motivoDerogaDurata === this.popupDatiTemporali.fieldMotivation) {
          this.closePopupDeroga(validationParams);
        }
      } else {
        if (validator.isValid) {
          this.iter.derogaSospensione = this.popupDatiTemporali.fieldDays;
          this.iter.motivoDerogaSospensione = this.popupDatiTemporali.fieldMotivation;
          doUpdate = true;
        }else if (this.iter.derogaSospensione === this.popupDatiTemporali.fieldDays && this.iter.motivoDerogaSospensione === this.popupDatiTemporali.fieldMotivation) {
          this.closePopupDeroga(validationParams);
        }
      }
    }

    if (doUpdate) {
      let iterClonato = Entity.cloneObject(this.iter);
      this.dataSourceIter.store().update(this.iter.id, iterClonato);
      if (this.popupDatiTemporali.action) {
        this.updateDataChiusuraPrevista();
        this.closePopupDeroga(validationParams);
      } else {
        this.closePopupNote();
      }
    }
  }

  public openCambiaResponsabile(e: any) {
    console.log("E = ", e);
    this.nuovoUtenteResponsabile = null;
    this.popupCambioResp.title = "Cambia responsabile procedimento";
    this.popupCambioResp.visible = true;
    this.popupCambioResp.respAttuale = e.procedimentoCache.nomeVisualResponsabileProcedimento;
    this.newIdRespDefault = "";
    if (!this.dataSourceUtenti) this.buildDataSourceUtenti();
  }

  closePopupResp() {
    console.log("NABBBB");
    this.popupCambioResp.visible = false;
    this.popupCambioResp.title = "";
    this.popupCambioResp.respAttuale = "";
    this.nuovoUtenteResponsabile = null;
    this.newIdRespDefault = "";
  }

  closePopupNote() {
    this.popupData.title = "";
    this.popupData.field = "";
    this.popupData.fieldValue = "";
    this.popupData.visible = false;
  }

  closePopupDeroga(validationParams: any) {
    this.popupDatiTemporali = {
      visible: false,
      title: "",
      fieldDays: 0,
      fieldMotivation: "",
      label: "",
      action: ""
    };

    // this.popupDatiTemporali.visible = false;
    validationParams.validationGroup.reset();
    // validationParams.validationGroup.validators = null;
    /* this.popupDatiTemporali.title = "";
    this.popupDatiTemporali.fieldDays = 0;
    this.popupDatiTemporali.fieldMotivation = "";
    this.popupDatiTemporali.action = ""; */
  }

  public cambiaResponsabileProcedimento() {
    console.log("EEE2 = ", this.nuovoUtenteResponsabile);
    const params = {
      idIter: this.iter.id,
      idFascicolo: this.iter.idFascicolo,
      cfResponsabile: this.nuovoUtenteResponsabile.idPersona.codiceFiscale
    };
    console.log("MAKEEE = ", params);
    const req = this.http.post(CUSTOM_RESOURCES_BASE_URL + "iter/cambiaResponsabileProcedimento", params, { headers: new HttpHeaders().set("content-type", "application/json") })
        .subscribe(
          res => {
            console.log("CIAOOO = ", res);
            notify({
              message: "Iter riattivato con successo",
              type: "success",
              position: TOAST_POSITION,
              width: TOAST_WIDTH
            });
            
          },
          err => {
            notify({
              message: "Qualcosa è andato storto. Contattare BabelCare",
              type: "error",
              position: TOAST_POSITION,
              width: TOAST_WIDTH
            });
          }
        );
  }

  public riattivaIter() {
    this.datiRiattivazioneIter.idIter = this.iter.id;
    const req = this.http.post(CUSTOM_RESOURCES_BASE_URL + "iter/riattivaIterSenzaDocumento", this.datiRiattivazioneIter, { headers: new HttpHeaders().set("content-type", "application/json") })
        .subscribe(
          res => {
            this.iter.idStato.codice = STATI.IN_CORSO;
            this.refresh();
            this.genericButtons = null;
            notify({
              message: "Iter riattivato con successo",
              type: "success",
              position: TOAST_POSITION,
              width: TOAST_WIDTH
            });
            this.popupRiattivaIterVisibile = false;
          },
          err => {
            notify({
              message: "Qualcosa è andato storto. Contattare BabelCare",
              type: "error",
              position: TOAST_POSITION,
              width: TOAST_WIDTH
            });
          }
        );
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
          notify({
            message: "Non esiste la fase successiva",
            type: "error",
            position: TOAST_POSITION,
            width: TOAST_WIDTH
          });
        });
  }

  /* public setParametriSospensione() {
    this.paramsPerSospensione = {
      iter: this.iter,
      stato: this.iter.idStato,
      dataSospensione: this.iter.idStato.codice === STATI.SOSPESO ? this.getDataUltimaSospensione() : null
    };
  } */

  /* public sospensioneIter() {
    this.sospensioneParams = new CambioDiStatoParams();
    this.sospensioneParams.idIter = this.idIter;
    this.sospensioneParams.numeroIter = this.iter.numero;
    this.sospensioneParams.annoIter = this.iter.anno;
    this.sospensioneParams.codiceStatoCorrente = this.iter.idStato.codice;
    this.popupData.title = "Cambia stato iter";
    this.sospensioneIterVisible = true;
  } */

  receiveMessage($event) {
    this.passaggioDiFaseVisible = $event["visible"];
    if ($event["proceduto"]) {
      this.refresh();
    }
  }

  refresh() {
    let perFigliNew: Object = { idIter: this.idIter, cambiato: !this.perFigliParteDestra["ricarica"]};
    this.perFigliParteDestra = perFigliNew;
    this.buildIter();
  }
  /* receiveMessageFromSospensione($event) {
    this.sospensioneIterVisible = $event["visible"];
    let perFigliNew: Object = { idIter: this.idIter, cambiato: !this.perFigliParteDestra["ricarica"]};
    this.perFigliParteDestra = perFigliNew;
    this.buildIter();
  } */


  onGenericButtonClick(buttonName: string) {
    switch (buttonName) {
      case "Riattiva Iter":
        this.popupRiattivaIterVisibile = true;
        break;
      /* case "Termina Sospensione":
      case "Sospendi":
        this.sospensioneIter();
        break;

      case "Procedi":
        this.passaggioDiFase();
        break; */
    }
  }

  /* getDataUltimaSospensione() {
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
  } */

  /* isIterFinito() {
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
  } */

  public calculateIodaPermissionAndSetButton(): void {
    IterProcedimentoFascicoloUtilsClass.getFascicoloIter(this.http, this.iter.idFascicolo)
    .subscribe(
      res => {
        this.fascicoloIter = res;
        this.settaVariabiliPermessi();
        if (this.permessoUtenteLoggato >= +PERMESSI.MODIFICA) {
          this.generateCustomButtons();
        }
      },
      err => {
        console.log("Errore nel recupero del fascicolo iter", err);
      }
    );    
  }

  public settaVariabiliPermessi() {
    this.permessoUtenteLoggato = +PERMESSI[this.fascicoloIter.permessi[this.userInfo.cf]];
  }

  customDisplayExprClassificazione(data: Titolo) {
    let displayExpression: string = "";
    if (data) {
      displayExpression = "[" + data.classificazione + "] " + data.nome;
    }
    return displayExpression;
  }

  calcolaSePubblicabileAllAlboAndSetClasseCss(idTipoProcedimento: number) {
    const oataContextDefinitionTemp: OdataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
    let dataSourceTemp = new DataSource({
      store: oataContextDefinitionTemp.getContext()[new RegistroTipoProcedimento().getName()],
      expand: ["idRegistro", "idTipoProcedimento"],
      filter: [["idTipoProcedimento.id", "=", idTipoProcedimento]],
    });
    dataSourceTemp.load().then(
      (res) => {
        this.classeDiHighlight = res.length > 0 ? "hightlightClass" : "";
        let perFigliNew: Object = { idIter: this.idIter, cambiato: !this.perFigliParteDestra["ricarica"], classeCSS: this.classeDiHighlight};
        this.perFigliParteDestra = perFigliNew;
      }
    );
  }

  public apriPopupVicari(): void {
    this.popupVicariVisibile = true;
    if (this.dataSourceVicari === undefined) {
      
    }
  }
}

interface UserInfo {
  idUtente: number;
  cf: string;
  idAzienda: number;
}