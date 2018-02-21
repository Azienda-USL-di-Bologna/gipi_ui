import { Component, OnInit } from "@angular/core";
import { LoggedUser } from "@bds/nt-login";
import { GlobalContextService } from "@bds/nt-context";
import { SospensioneParams } from "../classi/condivise/sospensione/sospensione-params";
import { ActivatedRoute, Params } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { bUtente, bAzienda } from "@bds/nt-entities";

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

  constructor( private activatedRoute: ActivatedRoute, private globalContextService: GlobalContextService) { 
    if (!this.userInfo) {
      this.recuperaUserInfo();
    }
   }

  ngOnInit() {
    // this.activatedRoute.queryParams.subscribe((queryParams: Params) => {
    //   this.infoDocumento = {
    //     registro: queryParams["registro"],
    //     numero: queryParams["numero"],
    //     anno: queryParams["anno"],
    //     oggetto: queryParams["oggetto"],
    //     dataRegistrazione: queryParams["dataRegistrazione"]
    //   }
    // });

    this.activatedRoute.queryParams.subscribe((queryParams: Params) => {
      this.sospensioneParams = new SospensioneParams();
      this.sospensioneParams.annoDocumento = queryParams["anno"];
      this.sospensioneParams.numeroDocumento = queryParams["numero"];
      this.sospensioneParams.codiceRegistroDocumento = queryParams["registro"];
      this.sospensioneParams.dataRegistrazioneDocumento = queryParams["dataRegistrazione"];
    });
    // this.sospensioneParams = new SospensioneParams();
    // this.sospensioneParams.annoDocumento = this.infoDocumento.anno;
    // this.sospensioneParams.numeroDocumento = this.infoDocumento.numero;
    // this.sospensioneParams.codiceRegistroDocumento = this.infoDocumento.registro;
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
                    cf: "GSLFNC89A05G224Y"
                  };
                }
            }
        )
    );
  }

  selectedRowChanged(e) {
    console.log("Iter: ", e);
    this.selectedIter = "Iter selezionato: " + e.numero + "/" + e.anno;
    this.sospensioneParams.numeroIter = e.numero;
    this.sospensioneParams.annoIter = e.anno;
    this.sospensioneParams.idIter = e.id;
    this.sospensioneParams.statoCorrente = e.stato;
  }

}

// interface InfoDocumento{
//   registro: string,
//   numero: string,
//   anno: number,
//   oggetto: string,
//   dataRegistrazione: Date,
// }

interface UserInfo{
  idUtente: number;
  cf: string;
  idAzienda: number;
}
