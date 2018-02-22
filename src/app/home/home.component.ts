import { Component, OnInit } from "@angular/core";
import {SessionManager, LoggedUser} from "@bds/nt-login";
import { GlobalContextService } from "@bds/nt-context";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {

  constructor(private sessionManager: SessionManager) {

      // if (this.globalContextService.getInnerSharedObject("loggedUser") === undefined) {
      //   let loggedUser = new LoggedUser(JSON.parse(sessionStorage.getItem("userInfo")));
      //   this.globalContextService.setSubjectInnerSharedObject("loggedUser", loggedUser);
      //   this.globalContextService.setInnerSharedObject("loggedUser", loggedUser);
      // }

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
