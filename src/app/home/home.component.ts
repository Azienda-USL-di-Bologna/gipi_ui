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

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  private userInfoMap: Object;
  username: String;
  ruolo: Ruolo;
  azienda: Azienda;
  strutture: Struttura[];
  struttureDiSeguito = "";

  constructor(private sessionManager: SessionManager){
    sessionManager.setExpireTokenOnIdle(300);
    this.userInfoMap = JSON.parse(sessionStorage.getItem("userInfoMap"));

    this.username = this.userInfoMap["username"];
    this.azienda = this.userInfoMap["azienda"];
    this.strutture = this.userInfoMap["strutture"];
    this.ruolo = this.userInfoMap["ruolo"];
    console.log("loggo le strutture", this.strutture);

    for (let i = 0; i < this.strutture.length; i++){
      let st: any = this.strutture[i];
      let mostra = st.idStruttura.nome + " (afferenza " + st.idAfferenzaStruttura.descrizione + ")";
      if (this.struttureDiSeguito === ""){
        this.struttureDiSeguito = mostra;
      }
      else{
        this.struttureDiSeguito = this.struttureDiSeguito + ";\n" + mostra;
      }
    }

    console.log("Loggalo lì ", this.struttureDiSeguito);
    this.struttureDiSeguito = this.struttureDiSeguito === "" ? "Nessuna struttura associata" : this.struttureDiSeguito;

  }
  ngOnInit() {
  }

}
