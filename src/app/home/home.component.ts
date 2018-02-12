import { Component, OnInit } from "@angular/core";
import {DEFAULT_INTERRUPTSOURCES, Idle} from "@ng-idle/core";
import {Keepalive} from "@ng-idle/keepalive";
import {Router} from "@angular/router";
import {SessionManager} from "../login/session-manager";
import { log } from "util";
import { Ruolo } from "app/classi/server-objects/entities/ruolo";
import { Azienda } from "app/classi/server-objects/entities/azienda";
import { Struttura } from "app/classi/server-objects/entities/struttura";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { GlobalContextService } from "@bds/nt-angular-context";
import { LoggedUser } from "../authorization/logged-user";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  username: String;
  ruolo: Ruolo;
  azienda: Azienda;
  strutture: Struttura[];
  struttureDiSeguito = "";
  private userInfoMap: Object;


  constructor(private sessionManager: SessionManager,
    private globalContextService: GlobalContextService) {

      if (this.globalContextService.getInnerSharedObject("loggedUser") === undefined) {
        let loggedUser = new LoggedUser(JSON.parse(sessionStorage.getItem("userInfo")));
        this.globalContextService.setSubjectInnerSharedObject("loggedUser", loggedUser);
        this.globalContextService.setInnerSharedObject("loggedUser", loggedUser);
      }

    // sessionManager.setExpireTokenOnIdle(300);
    // this.userInfoMap = JSON.parse(sessionStorage.getItem("userInfoMap"));
    //
    // this.username = this.userInfoMap["username"];
    // this.azienda = this.userInfoMap["azienda"];
    // this.struttureAfferenzaDiretta = this.userInfoMap["struttureAfferenzaDiretta"];
    // this.ruolo = this.userInfoMap["ruolo"];
    // // console.log("loggo le struttureAfferenzaDiretta", this.struttureAfferenzaDiretta);
    //
    // for (let i = 0; i < this.struttureAfferenzaDiretta.length; i++){
    //   let st: any = this.struttureAfferenzaDiretta[i];
    //   let mostra = st.idStruttura.nome + " (afferenza " + st.idAfferenzaStruttura.descrizione + ")";
    //   if (this.struttureDiSeguito === ""){
    //     this.struttureDiSeguito = mostra;
    //   }
    //   else{
    //     this.struttureDiSeguito = this.struttureDiSeguito + ";\n" + mostra;
    //   }
    // }
    //
    // // console.log("Loggalo lì ", this.struttureDiSeguito);
    // this.struttureDiSeguito = this.struttureDiSeguito === "" ? "Nessuna struttura associata" : this.struttureDiSeguito;

  }
  ngOnInit() {

  }

}
