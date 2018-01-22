import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from "@angular/core";
import { Iter } from "app/classi/server-objects/entities/iter";
import { EventoIter } from "app/classi/server-objects/entities/evento-iter";
import { HttpClient } from "@angular/common/http";
import { CUSTOM_RESOURCES_BASE_URL } from "environments/app.constants";
import { HttpHeaders } from "@angular/common/http";
import { SimpleChange } from "@angular/core/src/change_detection/change_detection_util";
import { debug } from "util";
import * as moment from "moment";
import { LoggedUser } from "../../authorization/logged-user"
import { GlobalContextService } from "@bds/nt-angular-context/global-context.service";


@Component({
  selector: "sospensione-iter",
  templateUrl: "./sospensione-iter.component.html",
  styleUrls: ["./sospensione-iter.component.scss"]
})
export class SospensioneIterComponent implements OnInit {
  public sospensioneParams: SospensioneParams;
  public dataDalDisabilitata: boolean;
  public testoSospensione: string = "Sospendi";
  public isSospeso: boolean = false; 
  public daInput: any = {
    iter: Iter,
    stato: String,
    dataSospensione: Date

  }; 
  public loggedUser: LoggedUser;
  

  @Input("params") 
  set params(params: any) {
    this.daInput = params;
    if (params.stato === "sospeso")
      this.isSospeso = true;
    else
      this.isSospeso = false;

    this.inizializza();

  }

  @Output() messageEvent = new EventEmitter<Object>();

  constructor(private http: HttpClient, private globalContextService: GlobalContextService) {
    console.log("*** sospensione-iter.component (constructor)");
  }

  ngOnChange(changes: SimpleChange) {
    this.inizializza();
  }


  ngOnInit() {
    this.inizializza();
  }

  inizializza() {

    this.sospensioneParams = new SospensioneParams();
    this.sospensioneParams.idIter = this.daInput.iter.id;

    this.loggedUser = this.globalContextService.getInnerSharedObject("loggedUser");
    this.sospensioneParams.idUtente = this.loggedUser.idUtente;
    this.sospensioneParams.sospesoDal = this.daInput.dataSospensione;
  }

  nomeBottone() {
    if (this.daInput.stato === "sospeso")
      return "Termina Sospensione";
    
    else
      return "Sospendi";
  }

  disabilitaSospesoDal() {
    if (this.daInput.stato === "sospeso")
      return true;
    else
      return false;
  }

  public closePopUp() {
    this.messageEvent.emit({visible: false});
  }

  gestisciSospensione() {
    if (this.sospensioneParams.valida(this.isSospeso)) {
      const req = this.http.post(CUSTOM_RESOURCES_BASE_URL + "iter/gestisciSospensione", this.sospensioneParams, {headers: new HttpHeaders().set("content-type", "application/json")})
      .subscribe(
        res => {
          let dataDiRitorno = +res["dataDiRitorno"];
          this.closePopUp();
         
        },
        err => {
          return;
        }
      );
    }
    else
      console.log("Alcuni valori non sono stati definiti");
  }

  handleEvent(nome: string, event: any) {
    switch (nome) {
      case "onClickAnnulla":
        this.closePopUp();
      break;

      case "onClickGestisciSospensione":
        if (this.sospensioneParams.valida(this.isSospeso))
          this.gestisciSospensione();
        else
          console.log("onClickGestisciSospensione --> alcuni dati sono incompleti");
      break;
    }
  }

  getDataUltimaSospensione() {
    let date;
      const req = this.http.get(CUSTOM_RESOURCES_BASE_URL + "iter/getUltimaSospensione" + "?idIter=" + this.daInput.iter.id)
      .subscribe(
        res => {
          let r: any = res;
          date = moment(r.dataSospensione);
          return date.format("DD-MM-YYYY");
        },
        err => {
          // this.showStatusOperation("L'avvio del nuovo iter è fallito. Contattare Babelcare", "error");
        }
      );
  }

}

class SospensioneParams {
  public idIter: number;
  public idUtente: number;
  public codiceRegistroDocumento: string;
  public numeroDocumento: string;
  public annoDocumento: number;
  public sospesoDal: Date;
  public sospesoAl: Date;
  public note: string;

  public valida(isSospeso: boolean) {
    let validato: boolean;
    if (this !== undefined && this.idIter != null && this.idIter.toString() !== ""
      && this.idUtente.toString() !== "" && this.idUtente != null  
      && this.codiceRegistroDocumento !== "" && this.codiceRegistroDocumento != null 
      && this.numeroDocumento.toString() !== "" && this.numeroDocumento != null 
      && this.annoDocumento.toString() !== "" && this.annoDocumento != null && this.annoDocumento.toString().length === 4) {
        if (isSospeso) {
          if (this.sospesoAl != null && this.sospesoAl.toString() !== "")
            validato = true;
          else 
            validato = false;
        }
        else {
          if (this.sospesoDal != null && this.sospesoDal.toString() !== "")
            validato = true;
          else 
            validato = false;
        }
    }
    else 
      validato = false;

    return validato;
  }

}
