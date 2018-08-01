import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import DataSource from "devextreme/data/data_source";
import { OdataContextDefinition, CustomLoadingFilterParams, OdataContextFactory, ButtonAppearance, GlobalContextService, Entity, OdataUtilities } from "@bds/nt-context";
import { CUSTOM_RESOURCES_BASE_URL, TOAST_WIDTH, TOAST_POSITION, ESITI } from "environments/app.constants";
import { Iter, Utente, ProcedimentoCache, bUtente, bAzienda, Titolo, RegistroTipoProcedimento, UtenteStruttura, GetUtentiGerarchiaStruttura, Struttura, Persona } from "@bds/nt-entities";
import { HttpClient  } from "@angular/common/http";
import notify from "devextreme/ui/notify";
import { ActivatedRoute, Params } from "@angular/router";
import { AfterViewInit } from "@angular/core/src/metadata/lifecycle_hooks";
import { LoggedUser } from "@bds/nt-login";
import { Observable, Subscription } from "rxjs";
import { HttpHeaders } from "@angular/common/http";
import { STATI } from "@bds/nt-entities";
import { DxFormComponent, DxPopupComponent } from "devextreme-angular";
import { IterProcedimentoFascicoloUtilsClass, PERMESSI } from "./iter-procedimento-fascicolo-utils.class";
import { UtilityFunctions } from "app/utility-functions";

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
  private utility: UtilityFunctions = new UtilityFunctions();
  private arrayCfVicari: string[];
  private arrayCfVicariNonCancellabili;
  
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
  public classeDiHighlightOggetto = "read-only-field ";
  public pubblicazioneAllAlbo: boolean = false;
  public popupRiattivaIterVisibile: boolean = false;
  public datiRiattivazioneIter: any = { note: "", idIter: null };
  public nuovoUtenteResponsabile: Utente;
  public nuovaStrutturaUtenteResp: Struttura;
  public mostraPulsantiVicResp = false;
  public mostraLookupVicari = false;
  public creatoreIterDescription: string;

  public popupVicariVisibile: boolean = false;
  public dataSourceVicari: DataSource;
  public listaVicariPopup: Vicario[];

  public fascicoloIter: any;
  public permessoUtenteLoggato: number;
  public customLoadingFilterParamsLookup: CustomLoadingFilterParams = new CustomLoadingFilterParams();
    

  @ViewChild("myForm1") myForm1: DxFormComponent;
  @ViewChild("popupVicari") popupVicari: DxPopupComponent;

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
  public popupModificaOggetto: any = {
    visible: false,
    title: "",
    fieldValue: "",
    label: ""
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
  public dataSourceUtentiCugini: DataSource;
  public dataSourceUtenteLoggato: DataSource;
  public dataSourceClassificazione: DataSource;
  public idUtenteDefault: number;
  public newIdRespDefault = "";
  public descrizioneUtenteResponsabile: string;
  public arrayEsiti: any[] = Object.keys(ESITI).map(key => ({ "codice": key, "descrizione": ESITI[key] }));

  public dataSourceUtentiTutti;

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
        "procedimentoCache.idStruttura",
        "idResponsabileProcedimento.idPersona",
        "idStrutturaResponsabileProcedimento",
        "idProcedimento.idAziendaTipoProcedimento.idTipoProcedimento",
        "idUtenteCreazione.idPersona",
        "idStrutturaUtenteCreazione"
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
          if (item.idResponsabileProcedimento && item.idStrutturaResponsabileProcedimento) {
            item.idResponsabileProcedimento.nomeVisualResponsabileProcedimento = item.idResponsabileProcedimento.idPersona.descrizione +
              " (" + item.idStrutturaResponsabileProcedimento.nome + ")";
          }
          // ora mi creo giusto il valore da mostrare nel campo dell'utente creatore iter
          if (item.idUtenteCreazione && item.idUtenteCreazione.idPersona && item.idStrutturaUtenteCreazione) {
            /* item.idUtenteCreazione.utenteStrutturaList.forEach(element => {
              if (element.idAfferenzaStruttura.codice === "DIRETTA")
              this.creatoreIterDescription = item.idUtenteCreazione.idPersona.descrizione + " (" + element.idStruttura.nome + ")";
            }); */
            this.creatoreIterDescription = item.idUtenteCreazione.idPersona.descrizione + " (" + item.idStrutturaUtenteCreazione.nome + ")";
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
    
    this.customLoadingFilterParamsLookup.addFilter("descrizione", ["tolower(${target})", "contains", "${value.tolower}"]);
    this.setCellValue = this.setCellValue.bind(this);
  }

  private buildDataSourceUtentiCugini(): void {
    /*
      Il caricamento del datasource per la lookup ha un problema. E' paginato. 
      Se l'utente loggato, che deve essere impostato come utente default, non è presente nella prima tranche di dati
      che il datasource tira su, allora non si riuscirà ad impostare l'utente default.
      Il workaraound consiste nel caricare l'utente loggato ed aggiungerlo qualora non fosse già presente.
    */
    this.dataSourceUtentiCugini = new DataSource({
      store: this.odataContextDefinitionFunctionImport.getContext()[new GetUtentiGerarchiaStruttura().getName()]
      .on("loading", (loadOptions) => {
        this.odataUtilities.filterToCustomQueryParams(["searchString"], loadOptions);
      }),
      customQueryParams: {
        idStruttura: this.iter.procedimentoCache.idStruttura.id
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
      this.dataSourceUtentiCugini.load().then(res => {
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
  
  private showStatusOperation(message: string, type: string) {
    notify({
      message: message,
        type: type,
        displayTime: 2100,
        position: TOAST_POSITION,
        width: TOAST_WIDTH
    });
  }
  
  public getDescrizioneUtente(item: any): string {
    return item ? item.idUtente.idPersona.descrizione 
        + " (" + item.idStruttura.nome
        + " - " + item.idAfferenzaStruttura.descrizione + ")" : null;
  }

  onValueChanged(e: any) {
    this.nuovoUtenteResponsabile = e.value.idUtente;
    this.nuovaStrutturaUtenteResp = e.value.idStruttura;
    this.newIdRespDefault = e.value;
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

  isChiuso() {
    return this.iter.idStato.codice === STATI.CHIUSO;
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
      // this.updateDataChiusuraPrevista();
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
          this.updateDataChiusuraPrevista();
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
        this.closePopupDeroga(validationParams);
      } else {
        this.closePopupNote();
      }
    }
  }

  public updateOggetto() {
    if (this.iter.oggetto !== this.popupModificaOggetto.fieldValue) {
      this.iter.oggetto = this.popupModificaOggetto.fieldValue;
      let iterClonato = Entity.cloneObject(this.iter);
      this.dataSourceIter.store().update(this.iter.id, iterClonato).then(
        res => {
          this.showStatusOperation("Modifica dell'oggetto effettuata.", "success");
          this.refresh();
        },
        err => {
          this.showStatusOperation("Modifica dell'oggetto fallita. Contattare BabelCare", "error");
        }
      );
    }
    this.closePopupModificaOggetto();
  }

  public openCambiaResponsabile(e: any) {
    this.nuovoUtenteResponsabile = null;
    this.nuovaStrutturaUtenteResp = null;
    this.popupCambioResp.title = "Cambia responsabile procedimento amministrativo";
    this.popupCambioResp.visible = true;
    this.popupCambioResp.respAttuale = e.idResponsabileProcedimento.nomeVisualResponsabileProcedimento;
    this.newIdRespDefault = "";
    if (!this.dataSourceUtentiCugini) this.buildDataSourceUtentiCugini();
  }

  public openModificaOggetto(e: any) {
    this.popupModificaOggetto.title = "Modifica oggetto";
    this.popupModificaOggetto.visible = true;
    this.popupModificaOggetto.fieldValue = e.oggetto;
  }

  closePopupModificaOggetto() {
    this.popupModificaOggetto.title = "";
    this.popupModificaOggetto.visible = false;
    this.popupModificaOggetto.fieldValue = "";
  }

  closePopupResp() {
    this.popupCambioResp.visible = false;
    this.popupCambioResp.title = "";
    this.popupCambioResp.respAttuale = "";
    this.nuovoUtenteResponsabile = null;
    this.nuovaStrutturaUtenteResp = null;
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
    const params = {
      idIter: this.iter.id,
      idFascicolo: this.iter.idFascicolo,
      idUtenteLoggato: this.userInfo.idUtente,
      idUtenteResponsabile: this.nuovoUtenteResponsabile.id,
      idStrutturaResponsabile: this.nuovaStrutturaUtenteResp.id,
      cfResponsabile: this.nuovoUtenteResponsabile.idPersona.codiceFiscale
    };
    if (this.iter.idResponsabileProcedimento.id !== this.nuovoUtenteResponsabile.id ||
      this.iter.idStrutturaResponsabileProcedimento.id !== this.nuovaStrutturaUtenteResp.id) {
      const req = this.http.post(CUSTOM_RESOURCES_BASE_URL + "iter/cambiaResponsabileProcedimento", params, { headers: new HttpHeaders().set("content-type", "application/json") })
          .subscribe(
          res => {
            this.showStatusOperation("Responsabile del procedimento cambiato con successo!", "success");
            this.refresh(); // Aggiorno l'iter per visualizzare il nuovo responsabile
            },
          err => {
            this.showStatusOperation("Modifica non andata a buon fine. Contattare BabelCare", "error");
            }
      );
    }
    this.closePopupResp();
  }

  public riattivaIter() {
    this.datiRiattivazioneIter.idIter = this.iter.id;
    const req = this.http.post(CUSTOM_RESOURCES_BASE_URL + "iter/riattivaIterSenzaDocumento", this.datiRiattivazioneIter, { headers: new HttpHeaders().set("content-type", "application/json") })
      .subscribe(
        res => {
          this.iter.idStato.codice = STATI.IN_CORSO;
          this.refresh();
          this.genericButtons = null;
          this.showStatusOperation("Iter riattivato con successo", "success");
          this.popupRiattivaIterVisibile = false;
        },
      err => {
        this.showStatusOperation("Qualcosa è andato storto. Contattare BabelCare", "error");
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
        this.showStatusOperation("Non esiste la fase successiva", "error");
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
        if (!this.isChiuso() && this.permessoUtenteLoggato >= +PERMESSI.VICARIO) {
          this.mostraPulsantiVicResp = true;
        } 
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
        this.classeDiHighlightOggetto = res.length > 0 ? "read-only-field hightlightClass" : "read-only-field";
        let perFigliNew: Object = { idIter: this.idIter, cambiato: !this.perFigliParteDestra["ricarica"], classeCSS: this.classeDiHighlight};
        this.perFigliParteDestra = perFigliNew;
      }
    );
  }


  // *************************
  // GESTIONE POPUP VICARI
  // *************************
  public apriPopupVicari(): void {
    if (!this.arrayCfVicari) {
      this.arrayCfVicari = IterProcedimentoFascicoloUtilsClass.calcolaArrayCfVicari(this.fascicoloIter.permessi);
    }
   
    console.log("VICARI = ", this.arrayCfVicari);
    let iter = this.iter;
    // Carico i vicari - Ogni volta altrimenti bisogna riapplicare il filtro 
    this.dataSourceVicari = new DataSource({
      store: this.odataContextDefinition.getContext()[new Persona().getName()],
      filter: [this.utility.buildMultipleFilterForArray(
        "codiceFiscale", 
        Object.assign([], this.arrayCfVicari)
        ), 
        "or", 
        ["codiceFiscale", "=", this.iter.idResponsabileProcedimento.idPersona.codiceFiscale]],
        map: function (item) {
          if (item.id === iter.idResponsabileProcedimento.idPersona.id) {
            item.descrizioneCalcolata = item.descrizione + " - Responsabile del procedimento";
            item.cancellabile = false;
          } else if (item.id === iter.procedimentoCache.idResponsabileAdozioneAttoFinale.idPersona.id) {
            item.descrizioneCalcolata = item.descrizione + " - Resp. adozione dell'atto finale";
            item.cancellabile = false;
          } else if (item.id === iter.procedimentoCache.idTitolarePotereSostitutivo.idPersona.id) {
            item.descrizioneCalcolata = item.descrizione + " - Titolare potere sostitutivo";
            item.cancellabile = false;
          } else if (iter.idUtenteCreazione && item.id === iter.idUtenteCreazione.idPersona.id) {
            item.descrizioneCalcolata = item.descrizione + " - Creatore dell'iter";
            item.cancellabile = true;
          } else {
            item.descrizioneCalcolata = item.descrizione;
            item.cancellabile = true;
          }
          return item;
        }
    });
    this.dataSourceVicari.load().then(res => {
      this.listaVicariPopup = [];
      let i = 1;  // Indice per ordinare i responsabili del fascicolo
      res.forEach(element => {
        let vicario = new Vicario();
        vicario.id = element.id;
        vicario.cf = element.codiceFiscale;
        vicario.descrizione = element.descrizioneCalcolata;
        vicario.cancellabile = element.cancellabile;
        switch (vicario.id) {
          case iter.idResponsabileProcedimento.idPersona.id:
            this.listaVicariPopup.splice(0, 0, vicario);
            break;
          case iter.procedimentoCache.idResponsabileAdozioneAttoFinale.idPersona.id:
            this.listaVicariPopup.splice(i++, 0, vicario);
            break;
          case iter.procedimentoCache.idTitolarePotereSostitutivo.idPersona.id:
            this.listaVicariPopup.splice(i, 0, vicario);
            break;
          case iter.idUtenteCreazione ? iter.idUtenteCreazione.idPersona.id : "":
            this.listaVicariPopup.splice(3, 0, vicario);
            break;
          default:
            this.listaVicariPopup.push(vicario);
            break;
        }
      });
    });
    this.buildLookupUtenti();
    this.popupVicariVisibile = true;
  }

  public buildLookupUtenti() {
    if (!this.dataSourceUtentiTutti) {
      this.dataSourceUtentiTutti = new DataSource({
        store: this.odataContextDefinition.getContext()[new UtenteStruttura().getName()].on("loading", (loadOptions) => {
          loadOptions.userData["customLoadingFilterParams"] = this.customLoadingFilterParamsLookup;
          this.odataContextDefinition.customLoading(loadOptions);
        }),
        expand: ["idUtente.idPersona", "idUtente.idAzienda", "idStruttura"],
        filter: [
          ["idUtente.idAzienda.id", "=", this.userInfo.idAzienda],
          ["idUtente.attivo", "=", true],
          ["!", 
            [
              this.utility.buildMultipleFilterForArray("idUtente.idPersona.codiceFiscale", Object.assign([], this.arrayCfVicari)), 
              "or",
              ["idUtente.idPersona.codiceFiscale", "=", this.iter.idResponsabileProcedimento.idPersona.codiceFiscale]
            ]
          ]
        ],
        map: function (item) {
          item.descrizioneCalcolata = item.idUtente.idPersona.descrizione + " (" + item.idStruttura.nome + ")";
          return item;
        }
      });
    } else {
      this.filtraUtenti(true);
    }
  }

  public aggiungiVicario() {
    this.mostraLookupVicari = true;
  }

  public onUtenteSelected(e) {
    let vicario = new Vicario();
    vicario.id = e.value.idUtente.idPersona.id;
    vicario.cf = e.value.idUtente.idPersona.codiceFiscale;
    vicario.descrizione = e.value.descrizioneCalcolata;
    vicario.cancellabile = true;
    this.listaVicariPopup.push(vicario);
    this.filtraUtenti(false);
  }
  /* Posiziono la scrollbar della table sull'ultimo utente inserito */
  public onContentReady(e) {
    setTimeout(function() {
        let scrollable = e.component.getScrollable();
        scrollable.scrollTo(scrollable.scrollHeight());
    }, 0);
  }

  public filtraUtenti(onCreate: boolean) {
    let arrayTemp = [];
    if (onCreate) {
      arrayTemp = this.arrayCfVicari;
    } else {
      this.listaVicariPopup.forEach(element => {
        arrayTemp.push(element.cf);
      });
    }
    this.dataSourceUtentiTutti.filter([
      ["idUtente.idAzienda.id", "=", this.userInfo.idAzienda],
      ["idUtente.attivo", "=", true],
      ["!", 
        [
          this.utility.buildMultipleFilterForArray("idUtente.idPersona.codiceFiscale", Object.assign([], arrayTemp)), 
          "or",
          ["idUtente.idPersona.codiceFiscale", "=", this.iter.idResponsabileProcedimento.idPersona.codiceFiscale]
        ]
      ]
    ]);
    this.dataSourceUtentiTutti.load();
  }

  setCellValue(rowData, value, currentData, componentInstance) {
    let vicario = new Vicario();
    let tempSource = new DataSource({
      store: this.odataContextDefinition.getContext()[new Persona().getName()],
      filter: ["id", "=", value]
    });
    tempSource.load().then(
      (res) => {
        this.arrayCfVicari.push(res[0].codiceFiscale);
        vicario.id = res[0].id;
        vicario.cf = res[0].codiceFiscale;
        vicario.descrizione = res[0].descrizione;
        vicario.cancellabile = true;
        this.listaVicariPopup.push(vicario);
      }
    );
  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.forEach(element => {
      if (element.name === "saveButton" || element.name === "revertButton") {
        element.visible = false;
      }
    });
  }

  salvaVicari() {
    this.arrayCfVicari.splice(0, this.arrayCfVicari.length);
    this.listaVicariPopup.forEach(element => {
      if (element.cf !== this.iter.idResponsabileProcedimento.idPersona.codiceFiscale) {
        this.arrayCfVicari.push(element.cf);
      }
    });
    let params = {
      "numerazioneGerarchica": this.iter.idFascicolo,
      "vicari": this.arrayCfVicari
    };
    const call = this.http.post(
      CUSTOM_RESOURCES_BASE_URL + "iter/aggiornaVicariDelFascicolo", 
      params, 
      { headers: new HttpHeaders().set("content-type", "application/json") }
    ).subscribe(
      res => {
        // Per il momento mi faccio ridare il fascicolo e lo risetto in modo che sia sempre bello aggiornato.
        this.fascicoloIter = res;
        this.showStatusOperation("Vicari salvati con successo", "success");
        this.closePopupVicari();
      },
      err => {
        this.showStatusOperation("C'è stato un errore nel salvataggio dei vicari. Se il problema persiste contattare babelcare.", "error");
      }
    );  
  }

  closePopupVicari() {
    this.popupVicari.instance.hide().then(r => {
      this.onHidden();
    });
  }

  onHidden() {
    this.mostraLookupVicari = false;
    this.listaVicariPopup.splice(0, this.listaVicariPopup.length);
  }

  eliminaVicario(e) {
    if (e.data && !e.data.cancellabile) {
      this.showStatusOperation("Non puoi cancellare questo vicario", "warning");
    } else {
      let index = this.listaVicariPopup.findIndex(el => el === e.key);
      this.listaVicariPopup.splice(index, 1);
      this.filtraUtenti(false);
    }
  }

  filtraDataSourceVicari() {
    this.dataSourceVicari.filter([this.utility.buildMultipleFilterForArray(
      "codiceFiscale", 
      Object.assign([], this.arrayCfVicari)), 
      "or", 
      ["codiceFiscale", "=", this.iter.idResponsabileProcedimento.idPersona.codiceFiscale]]);
    this.dataSourceVicari.load();
  }

  // *************************
  // FINE GESTIONE POPUP VICARI
  // *************************
}

class Vicario {
  id: number;
  cf: string;
  descrizione: string;
  cancellabile: boolean;
}

interface UserInfo {
  idUtente: number;
  cf: string;
  idAzienda: number;
}