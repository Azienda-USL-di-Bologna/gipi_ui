import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Iter } from "app/classi/server-objects/entities/iter";
import { EventoIter } from "app/classi/server-objects/entities/evento-iter";
import { HttpClient } from "@angular/common/http";
import { CUSTOM_RESOURCES_BASE_URL } from "environments/app.constants";
import { HttpHeaders } from "@angular/common/http";

@Component({
  selector: "sospensione-iter",
  templateUrl: "./sospensione-iter.component.html",
  styleUrls: ["./sospensione-iter.component.scss"]
})
export class SospensioneIterComponent implements OnInit {

  @Input("params") params: Iter;
  @Output() messageEvent = new EventEmitter<Object>();
  public sospensioneParams: SospensioneParams = new SospensioneParams();
  public dataDalDisabilitata: boolean;
  public testoSospensione: string = "Sospendi";

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.sospensioneParams.idIter = this.params.id;
    this.sospensioneParams.idUtente = JSON.parse(sessionStorage.getItem("userInfoMap")).idUtente;
    console.log("loggo,loggo,loggo....   ", this.params);
    if (this.params.stato === "sospeso") {
      this.testoSospensione = "Termina Sospensione";
      const req = this.http.get(CUSTOM_RESOURCES_BASE_URL + "iter/getUltimaSospensione" + "?idIter=" + this.params.id)
      .subscribe(
        res => {
          console.log("Ecco la risposta:");
          console.log(res);
          let r: any = res;
          console.log(r.dataSospensione);
          console.log(Date.parse(r.dataSospensione));
          // this.sospensioneParams.sospesoDal = Date(r.dataSospensione);
          // this.closePopUp(idIter);
        },
        err => {
          // this.showStatusOperation("L'avvio del nuovo iter è fallito. Contattare Babelcare", "error");
        }
      );
    }
    else {}// nulla

  }

  nomeBottone() {
    if (this.params == null)
      return "Sospendi";
    
    else
      return "Termina Sospensione";
  }

  disabilitaSospesoDal() {
    if (this.params.stato === "sospeso")
      return true;
    else
      return false;
  }

  public closePopUp() {
    this.messageEvent.emit({visible: false});
  }


  lanciaSospensione() {
    // controllare che l'iter non sia finito
    console.log(this.sospensioneParams);
    const req = this.http.post(CUSTOM_RESOURCES_BASE_URL + "iter/lanciaSospensione", this.sospensioneParams, {headers: new HttpHeaders().set("content-type", "application/json")})
    .subscribe(
      res => {
        console.log("Ecco la risposta:");
        console.log(res);
        this.closePopUp();
       
      },
      err => {
        // this.showStatusOperation("L'avvio del nuovo iter è fallito. Contattare Babelcare", "error");
      }
    );

  }


  terminaSospensione() {
    // richiesta al server di terminare sospensione
    console.log(this.sospensioneParams);
    const req = this.http.post(CUSTOM_RESOURCES_BASE_URL + "iter/terminaSospensione", this.sospensioneParams, {headers: new HttpHeaders().set("content-type", "application/json")})
    .subscribe(
      res => {
        console.log("Ecco la risposta:");
        console.log(res);
        this.closePopUp();
       
      },
      err => {
        // this.showStatusOperation("L'avvio del nuovo iter è fallito. Contattare Babelcare", "error");
      }
    );
  }


  gestisciSospensione() {
    switch (this.params.stato){
      case "sospeso":
        this.terminaSospensione();
      break;

      // lo sospendiamo
      default:
        this.lanciaSospensione();
      break;

    }
  }

  handleEvent(nome: string, event: any) {
    switch (nome) {
      case "onClickAnnulla":
        this.closePopUp();
      break;

      case "onClickGestisciSospensione":
        this.gestisciSospensione();
      break;
    }
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
}