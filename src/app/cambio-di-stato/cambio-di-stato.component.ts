import { Component, OnInit } from '@angular/core';
import { LoggedUser } from "../authorization/logged-user"
import { GlobalContextService } from "@bds/nt-angular-context/global-context.service";
import { ListaIterConPermessiComponent } from "./lista-iter-con-permessi/lista-iter-con-permessi.component";
import { CambioDiStatoBoxComponent } from "../cambio-di-stato-box/cambio-di-stato-box.component";
import { SospensioneParams } from "../classi/condivise/sospensione/sospensione-params";
import { ActivatedRoute, Params } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'app-cambio-di-stato',
  templateUrl: './cambio-di-stato.component.html',
  styleUrls: ['./cambio-di-stato.component.scss']
})
export class CambioDiStatoComponent implements OnInit {

  public sospensioneParams : SospensioneParams;
  public infoDocumento: InfoDocumento;
  public userInfo: UserInfo;

  public loggedUser$: Observable<LoggedUser>;
  private subscriptions: Subscription[] = [];

  constructor( private activatedRoute: ActivatedRoute, private globalContextService: GlobalContextService) { 
    this.activatedRoute.queryParams.subscribe((queryParams: Params) => {
      this.infoDocumento = {
        registro: queryParams["registro"],
        numero: queryParams["numero"],
        anno: queryParams["anno"],
        oggetto: queryParams["oggetto"],
        dataRegistrazione: queryParams["dataRegistrazione"]
      }
    });
    if(!this.userInfo){
      this.recuperaUserInfo();
    }
    console.log("user info constructo", this.userInfo);
    
   }

  inizializza() {
      this.sospensioneParams = new SospensioneParams();
      
      // this.sospensioneParams.idIter = 113; //this.daInput.iter.id
  
      // this.loggedUser = this.globalContextService.getInnerSharedObject("loggedUser");
      // this.sospensioneParams.idUtente = this.loggedUser.idUtente;
      // this.sospensioneParams.dataCambioDiStato = new Date(); //this.daInput.dataSospensione
      // this.sospensioneParams.note = "bla bla bla"
  }

  ngOnInit() {
    this.inizializza();
    this.recuperaUserInfo();
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
                  console.log("user info appena messo", this.userInfo)
                }
            }
        )
    );
  }

  selectedRowChanged(e){
    
    console.log("emitted event recived", e)
    this.sospensioneParams = new SospensioneParams();
    this.sospensioneParams.idIter = e.id;
    this.sospensioneParams.statoCorrente = e.stato;
    this.sospensioneParams.annoDocumento = this.infoDocumento.anno;
    this.sospensioneParams.numeroDocumento = this.infoDocumento.numero;
    this.sospensioneParams.codiceRegistroDocumento = this.infoDocumento.registro;
    // this.sospensioneParams.numeroDocumento = e.
  }

}

interface InfoDocumento{
  registro: string,
  numero: string,
  anno: number,
  oggetto: string,
  dataRegistrazione: Date,
}

interface UserInfo{
  idUtente: number;
  cf: string;
  idAzienda: number;
}
