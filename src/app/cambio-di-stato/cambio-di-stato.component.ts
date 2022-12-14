import { Component, OnInit } from "@angular/core";
import { LoggedUser } from "@bds/nt-login";
import { GlobalContextService } from "@bds/nt-context";
import { PassaggioDiFaseComponent } from "../iter-procedimento/passaggio-di-fase/passaggio-di-fase.component";
import { CambioDiStatoParams } from "../classi/condivise/sospensione/gestione-stato-params";
import { ActivatedRoute, Params } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { bUtente, bAzienda, STATI } from "@bds/nt-entities";
import notify from "devextreme/ui/notify";
import { TOAST_WIDTH, TOAST_POSITION } from "environments/app.constants";
import {AppConfiguration} from "../config/app-configuration";
import { SospensioneParams } from "../classi/condivise/sospensione/sospensione-params";
import { UtilityFunctions } from "../utility-functions";

@Component({
  selector: "app-cambio-di-stato",
  templateUrl: "./cambio-di-stato.component.html",
  styleUrls: ["./cambio-di-stato.component.scss"]
})
export class CambioDiStatoComponent implements OnInit {

  private subscriptions: Subscription[] = [];

  public sospensioneParams: CambioDiStatoParams;
  public userInfo: UserInfo;
  public selectedIter: string = "Selezionare un iter dalla tabella";

  public loggedUser$: Observable<LoggedUser>;

  public showPopupAnnullamento: boolean = false;
  public messaggioAnnullamento: string;
  public lookupItems: string[] = ["Cambio di stato", "Passaggio di fase"];
  public lookupValue: string= "";
  public titleDataDocumento: string;


  constructor( private activatedRoute: ActivatedRoute, private globalContextService: GlobalContextService, private appConfig: AppConfiguration) {
    console.log("app-cambio-di-stato constructor");
    if (!this.userInfo) {
      this.recuperaUserInfo();
    }
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((queryParams: Params) => {
      this.sospensioneParams = new CambioDiStatoParams();
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
      if (queryParams["descrizione"]) {
        this.sospensioneParams.descrizione = decodeURIComponent(queryParams["descrizione"].replace(/\+/g, " "));
      }
      if (queryParams["idApplicazione"]) {
        this.sospensioneParams.idApplicazione = decodeURIComponent(queryParams["idApplicazione"].replace(/\+/g, " "));
      }
      const noBars: boolean = queryParams["nobars"];

      console.log("MO VEDIAMO...");
      console.log("glogParams", queryParams["glogParams"]);
      this.sospensioneParams.glogParams = queryParams["glogParams"];
    });
  }

  recuperaUserInfo() {
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
                }
            }
        )
    );
  }

  selectedRowChanged(e) {
    console.log("selectedRowChanged(e)");
    console.log("this.sospensioneParams.azione", this.sospensioneParams.azione);
    let cloneSospensione = new CambioDiStatoParams();
    Object.assign(cloneSospensione, this.sospensioneParams);
    this.sospensioneParams = cloneSospensione;
    this.selectedIter = "Iter selezionato: " + e.numero + "/" + e.anno;
    this.lookupValue = null;
    this.sospensioneParams.numeroIter = e.numero;
    this.sospensioneParams.annoIter = e.anno;
    this.sospensioneParams.idIter = e.id;
    this.sospensioneParams.dataAvvioIter = e.dataAvvio;
    this.sospensioneParams.codiceStatoCorrente = e.idStato.codice;
    this.sospensioneParams.oggettoIter = e.oggetto;
    // this.sospensioneParams.isFaseDiChiusura = e.idFaseCorrente.faseDiChiusura;
    // console.log("Father sospensione params: ", this.sospensioneParams);
    // if ((this.sospensioneParams.codiceStatoCorrente === STATI.SOSPESO.CODICE) && this.lookupItems.length !== 1) {
    //   this.lookupItems = ["Cambio di stato"];
    //   this.lookupValue = "Cambio di stato";
    // }else if (this.lookupItems.length === 1) {
    //   this.lookupItems = ["Cambio di stato", "Passaggio di fase"];
    // }
  }

  lookupValueChanged(e) {
    this.lookupValue = e.value;
    if ((e.value === "Passaggio di fase" || e.value === "Cambio di stato") 
      && (this.sospensioneParams.codiceStatoCorrente === STATI.CHIUSO || this.sospensioneParams.isFaseDiChiusura)) {
      notify({
        message: "Il procedimento ?? gi?? nell'ultima fase prevista: Fase di chiusura.",
        type: "warning",
        displayTime: 4000,
        position: TOAST_POSITION,
        width: TOAST_WIDTH
      });
    }
    
  }

}

interface UserInfo{
  idUtente: number;
  cf: string;
  idAzienda: number;
}
