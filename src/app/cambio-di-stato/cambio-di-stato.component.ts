import { Component, OnInit } from '@angular/core';
import { LoggedUser } from "../authorization/logged-user"
import { GlobalContextService } from "@bds/nt-angular-context/global-context.service";
import { ListaIterConPermessiComponent } from "./lista-iter-con-permessi/lista-iter-con-permessi.component";
import { CambioDiStatoBoxComponent } from "../cambio-di-stato-box/cambio-di-stato-box.component"
import { SospensioneParams } from "../classi/condivise/sospensione/sospensione-params"

@Component({
  selector: 'app-cambio-di-stato',
  templateUrl: './cambio-di-stato.component.html',
  styleUrls: ['./cambio-di-stato.component.scss']
})
export class CambioDiStatoComponent implements OnInit {

  public sospensioneParams : SospensioneParams;

  constructor() { }

  inizializza() {
      this.sospensioneParams = new SospensioneParams();
      this.sospensioneParams.idIter = 113; //this.daInput.iter.id
  
      // this.loggedUser = this.globalContextService.getInnerSharedObject("loggedUser");
      // this.sospensioneParams.idUtente = this.loggedUser.idUtente;
      this.sospensioneParams.sospesoDal = new Date(); //this.daInput.dataSospensione
      this.sospensioneParams.note = "bla bla bla"
  }

  ngOnInit() {
    this.inizializza();
  }

  selectedRowChanged(e){
    console.log("emitted event recived")
    this.sospensioneParams = new SospensioneParams();
    this.sospensioneParams.idIter = e;
  }

}
