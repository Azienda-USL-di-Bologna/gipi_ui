import { Component, OnInit } from "@angular/core";
import { OdataContextFactory, OdataContextDefinition, GlobalContextService } from "@bds/nt-context";
import DataSource from "devextreme/data/data_source";
import { Iter, bUtente, bAzienda, STATI } from "@bds/nt-entities";
import { ActivatedRoute, Params } from "@angular/router";
import { CambioDiStatoParams } from "../classi/condivise/sospensione/gestione-stato-params";
import { UtilityFunctions } from "../utility-functions";
import { resolve } from "url";
import { AppConfiguration } from "../config/app-configuration";
import { Observable, Subscription } from "rxjs";
import { LoggedUser } from "@bds/nt-login";
import notify from "devextreme/ui/notify";
import { TOAST_POSITION, TOAST_WIDTH } from "environments/app.constants";

@Component({
  selector: 'app-modifica-documento-iter',
  templateUrl: './modifica-documento-iter.component.html',
  styleUrls: ['./modifica-documento-iter.component.scss']
})
export class ModificaDocumentoIterComponent implements OnInit {
  private odataContextDefinition: OdataContextDefinition;
  public dataSourceIter: DataSource;
  public iter: Iter;
  public sospensioneParams: CambioDiStatoParams;
  public titleDataDocumento: string;
  public azioniArray: string[] = new Array();
  public azioneRichiesta: string;
  public action: string;
  public userInfo: UserInfo;
  public loggedUser$: Observable<LoggedUser>;
  private subscriptions: Subscription[] = [];

  constructor(private odataContextFactory: OdataContextFactory, private activatedRoute: ActivatedRoute, private appConfig: AppConfiguration, private globalContextService: GlobalContextService) {
    console.log("app-modifica-documento-iter constructor");
    this.odataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
    this.recuperaUserInfo();
  }

  ngOnInit(){
    console.log("app-modifica-documento-iter ngOnInit");
    this.azioniArray = new Array();
    this.readLoadAndSetAll();
  };

  public onSelectionChange(selection: any){
    console.log("onSelectionChange", selection)
    switch(selection){
      case "Associa":
        this.sospensioneParams.azione = 'associazione';
        this.sospensioneParams.codiceStatoProssimo = this.sospensioneParams.codiceStatoCorrente
      break;

      case "Chiudi":
        this.sospensioneParams.azione = 'cambio_di_stato';
        this.sospensioneParams.codiceStatoProssimo = STATI.CHIUSO
      break;
            
      case "Riattiva":
        this.sospensioneParams.azione = 'cambio_di_stato';
        this.sospensioneParams.codiceStatoProssimo = STATI.IN_CORSO
      break;
      
      case "Sospendi":
        this.sospensioneParams.azione = 'cambio_di_stato';
        this.sospensioneParams.codiceStatoProssimo = STATI.SOSPESO
      break;
    }
    this.action = this.sospensioneParams.azione;
  }

  async loadIter(idIterPar: number) {
    console.log("loadIter(idIterPar: number)");
    this.dataSourceIter = new DataSource({
      store: this.odataContextDefinition.getContext()[new Iter().getName()],
      expand: ["idStato", "idProcedimento", "procedimentoCache"],
      filter: ["id", "=", idIterPar]
    });
    await this.dataSourceIter.load().then(res => {
      console.log("RES", res);
      this.iter = res[0];
      console.log("this.iter",this.iter)
    },
    err =>{
      console.log("err", err);
    })
  };

  

  async readLoadAndSetAll() {
    console.log("readParamsAndLoadIter()");
    await this.readParams();
    await this.loadIter(this.sospensioneParams.idIter);
    this.sospensioneParams.codiceStatoCorrente = this.iter.idStato.codice;
    this.sospensioneParams.numeroIter = this.iter.numero;
    this.sospensioneParams.annoIter = this.iter.anno;
    this.sospensioneParams.oggettoIter = this.iter.oggetto;
    this.sospensioneParams.codiceStatoCorrente = this.iter.idStato.codice;
    await this.setAzioni(this.sospensioneParams.azione, this.sospensioneParams.codiceStatoProssimo);
    await this.setAzioneCorrente();
  }

  async readParams() {
    console.log("readParams()");
    await this.activatedRoute.queryParams.subscribe((queryParams: Params) => {
      this.sospensioneParams = new CambioDiStatoParams();
      this.sospensioneParams.idIter = +queryParams["idIter"]
      this.sospensioneParams.annoDocumento = queryParams["anno"];
      this.sospensioneParams.numeroDocumento = queryParams["numero"];
      this.sospensioneParams.codiceRegistroDocumento = queryParams["registro"];
      this.sospensioneParams.dataRegistrazioneDocumento = queryParams["dataRegistrazione"];
      this.titleDataDocumento = UtilityFunctions.formatDateToString(new Date(this.sospensioneParams.dataRegistrazioneDocumento));
      if (queryParams["oggetto"]) {
        this.sospensioneParams.oggettoDocumento = decodeURIComponent(queryParams["oggetto"].replace(/\+/g, " "));
      }
      this.sospensioneParams.azione = queryParams["azione"] ? queryParams["azione"].toLowerCase() : undefined;
      this.sospensioneParams.codiceStatoProssimo = queryParams["stato"].toUpperCase();
      this.sospensioneParams.isFaseDiChiusura = this.sospensioneParams.codiceStatoProssimo === STATI.CHIUSO;
      this.sospensioneParams.idOggettoOrigine = queryParams["idOggettoOrigine"];
      this.sospensioneParams.tipoOggettoOrigine = queryParams["tipoOggettoOrigine"];
      this.sospensioneParams.note = queryParams["note"];
      this.sospensioneParams.esito = queryParams["esito"];
      this.sospensioneParams.esitoMotivazione = queryParams["esitoMotivazione"];
      if (queryParams["descrizione"]) {
        this.sospensioneParams.descrizione = decodeURIComponent(queryParams["descrizione"].replace(/\+/g, " "));
      }
      if (queryParams["idApplicazione"]) {
        this.sospensioneParams.idApplicazione = decodeURIComponent(queryParams["idApplicazione"].replace(/\+/g, " "));
      }
      const noBars: boolean = queryParams["nobars"];
      this.sospensioneParams.glogParams = queryParams["glogParams"];
            
      console.log("this.sospensioneParams", this.sospensioneParams);
    });
  }

  async setAzioni(azione: string, stato: string) {
    console.log("setAzioni()");
    console.log("azione", azione);
    console.log("stato", stato);

    if(this.iter){
      console.log("popolo le azioni");
      console.log("this.iter.idStato",this.iter.idStato)
      if(this.iter.idStato.codice === STATI.IN_CORSO) {
        this.azioniArray.push("Sospendi");
        this.azioniArray.push("Associa");
        this.azioniArray.push("Chiudi");
        /* this.azioniArray.push("{id: 'chiudi', val: 'Chiudi'}");
        this.azioniArray.push("{id: 'associa', val: 'Associa'}");
        this.azioniArray.push("{id: 'sospendi', val: 'Sospendi'}"); */
      }
      else if(this.iter.idStato.codice === STATI.SOSPESO) {
        this.azioniArray.push("Riattiva");
        this.azioniArray.push("Associa");
        this.azioniArray.push("Chiudi");
        /* this.azioniArray.push("{id: 'chiudi', val: 'Chiudi'}");
        this.azioniArray.push("{id: 'associa', val: 'Associa'}");
        this.azioniArray.push("{id: 'riattiva', val: 'Riattiva'}"); */
      }
    };
    console.log(this.azioniArray);
  }

  async setAzioneCorrente() {
    if(this.iter && this.iter.idStato.codice !== STATI.CHIUSO) {
      console.log("this.sospensioneParams.azione", this.sospensioneParams.azione);
      console.log("this.sospensioneParams.codiceStatoProssimo", this.sospensioneParams.codiceStatoProssimo);
      if(this.sospensioneParams.azione === "associazione"){
        this.azioneRichiesta = "Associa";
        this.action = "associazione"
      }
      else if(this.sospensioneParams.azione === "cambio_di_stato" && this.sospensioneParams.codiceStatoProssimo === STATI.SOSPESO){
        this.azioneRichiesta = "Sospendi";
        this.action = "cambio_di_stato"
      }
      else if(this.sospensioneParams.azione === "cambio_di_stato" && this.sospensioneParams.codiceStatoProssimo === STATI.CHIUSO){
        this.azioneRichiesta = "Chiudi";
        this.action = "cambio_di_stato"
      }
      else if(this.sospensioneParams.azione === "cambio_di_stato" && this.sospensioneParams.codiceStatoProssimo === STATI.IN_CORSO){
        this.azioneRichiesta = "Riattiva";
        this.action = "cambio_di_stato"
      }
    }

  }

  recuperaUserInfo() {
    console.log("recuperaUserInfo");
    this.loggedUser$ = this.globalContextService.getSubjectInnerSharedObject("loggedUser");
    this.subscriptions.push(
        this.loggedUser$.subscribe(
            (loggedUser: LoggedUser) => {
                if (loggedUser) {
                  this.userInfo = {
                    idUtente: loggedUser.getField(bUtente.id),
                    idAzienda:  loggedUser.getField(bUtente.aziendaLogin)[bAzienda.id],
                    cf: loggedUser.getField(bUtente.codiceFiscale)
                  };
                  console.log("HO IL LOGGED USER", this.userInfo)
                }
            }
        )
    );
  }
}

interface UserInfo{
  idUtente: number;
  cf: string;
  idAzienda: number;
}