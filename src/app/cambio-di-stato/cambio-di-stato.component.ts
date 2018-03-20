import { Component, OnInit } from "@angular/core";
import { LoggedUser } from "@bds/nt-login";
import { GlobalContextService } from "@bds/nt-context";
import { PassaggioDiFaseComponent } from "../iter-procedimento/passaggio-di-fase/passaggio-di-fase.component"
import { SospensioneParams } from "../classi/condivise/sospensione/sospensione-params";
import { ActivatedRoute, Params } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { bUtente, bAzienda } from "@bds/nt-entities";
import notify from "devextreme/ui/notify";
import {AppConfiguration} from "../config/app-configuration";

@Component({
  selector: "app-cambio-di-stato",
  templateUrl: "./cambio-di-stato.component.html",
  styleUrls: ["./cambio-di-stato.component.scss"]
})
export class CambioDiStatoComponent implements OnInit {

  private subscriptions: Subscription[] = [];

  public sospensioneParams: SospensioneParams;
  public userInfo: UserInfo;
  public selectedIter: string = "Selezionare un iter dalla tabella";

  public loggedUser$: Observable<LoggedUser>;

  public showPopupAnnullamento: boolean = false;
  public messaggioAnnullamento: string;
  public lookupItems: string[] = ["Cambio di stato", "Passaggio di fase"];
  public lookupValue: string= "";


  constructor( private activatedRoute: ActivatedRoute, private globalContextService: GlobalContextService, private appConfig: AppConfiguration) {
    if (!this.userInfo) {
      this.recuperaUserInfo();
    }
   }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((queryParams: Params) => {
      this.sospensioneParams = new SospensioneParams();
      this.sospensioneParams.annoDocumento = queryParams["anno"];
      this.sospensioneParams.numeroDocumento = queryParams["numero"];
      this.sospensioneParams.codiceRegistroDocumento = queryParams["registro"];
      this.sospensioneParams.dataRegistrazioneDocumento = queryParams["dataRegistrazione"];
      const noBars: boolean = queryParams["nobars"];
      if (!!noBars) {
        this.appConfig.setAppBarVisible(false);
        this.appConfig.setSideBarVisible(false);
      }
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
    this.selectedIter = "Iter selezionato: " + e.numero + "/" + e.anno;
    this.sospensioneParams.numeroIter = e.numero;
    this.sospensioneParams.annoIter = e.anno;
    this.sospensioneParams.idIter = e.id;
    this.sospensioneParams.statoCorrente = e.stato;
    this.sospensioneParams.isFaseDiChiusura = e.idFaseCorrente.faseDiChiusura;
  }

  lookupValueChanged(e){
    this.lookupValue = e.value;
    if(e.value === "Passaggio di fase" && this.sospensioneParams.isFaseDiChiusura){
      notify({
        message: "Il procedimento è già nell'ultima fase prevista: Fase di chiusura.",
        type: "warning",
        displayTime: 4000,
        position: {
          my: "center", at: "center", of: window
        },
        width: "max-content"
      });
    }
  }

}

interface UserInfo{
  idUtente: number;
  cf: string;
  idAzienda: number;
}
