import { Component, OnInit } from '@angular/core';
import { LoggedUser } from "../authorization/logged-user"
import { GlobalContextService } from "@bds/nt-angular-context/global-context.service";
import { ListaIterConPermessiComponent } from "./lista-iter-con-permessi/lista-iter-con-permessi.component";
import { CambioDiStatoBoxComponent } from "../cambio-di-stato-box/cambio-di-stato-box.component";
import { PassaggioDiFaseComponent } from "../iter-procedimento/passaggio-di-fase/passaggio-di-fase.component"
import { SospensioneParams } from "../classi/condivise/sospensione/sospensione-params";
import { ActivatedRoute, Params } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { Iter } from "../classi/server-objects/entities/iter";

@Component({
  selector: 'app-cambio-di-stato',
  templateUrl: './cambio-di-stato.component.html',
  styleUrls: ['./cambio-di-stato.component.scss']
})
export class CambioDiStatoComponent implements OnInit {

  public sospensioneParams : SospensioneParams;
  public userInfo: UserInfo;
  public selectedIter: string = "Selezionare un iter dalla tabella";

  public loggedUser$: Observable<LoggedUser>;
  private subscriptions: Subscription[] = [];

  public showPopupAnnullamento : boolean = false;
  public messaggioAnnullamento : string;
  public lookupItems: string[] = ["Cambio di stato", "Passaggio di fase"];
  public lookupValue: string= "";


  constructor( private activatedRoute: ActivatedRoute, private globalContextService: GlobalContextService) { 
    if(!this.userInfo){
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
    });
  }

  recuperaUserInfo(){
    this.loggedUser$ = this.globalContextService.getSubjectInnerSharedObject("loggedUser");
    this.subscriptions.push(
        this.loggedUser$.subscribe(
            (loggedUser: LoggedUser) => {
                if (loggedUser) {
                  this.userInfo = {
                    idUtente: loggedUser.idUtente,
                    idAzienda:  loggedUser.aziendaLogin.id,
                    cf: "GSLFNC89A05G224Y"
                  }
                }
            }
        )
    );
  }

  selectedRowChanged(e){
    console.log("Iter: ", e)
    this.selectedIter = "Iter selezionato: " + e.numero + "/" + e.anno;
    this.sospensioneParams.numeroIter = e.numero;
    this.sospensioneParams.annoIter = e.anno;
    this.sospensioneParams.idIter = e.id;
    this.sospensioneParams.statoCorrente = e.stato;
  }

  lookupValueChanged(e){
    this.lookupValue = e.value;
  }

}

interface UserInfo{
  idUtente: number;
  cf: string;
  idAzienda: number;
}
