import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CUSTOM_RESOURCES_BASE_URL } from "environments/app.constants";


@Injectable()
export class ParametriAziendaService {

  public parametriAzienda: Map<string, any>;

  constructor(private http: HttpClient) { }

  /**
   * Carica i parametri dal database e costruisce una mappa con tutti i parametri dell'azienda
   * @param {string} idApplicazione Id dell'applicazione da filtrare nei parametri Es. "gipi"
   * @param {string} idAzienda Id dell'azienda
  */
  getParametri(idApp: string, idAz: string) {
    this.parametriAzienda = new Map();
    const myParams = new HttpParams().set("idApplicazione", idApp).set("idAzienda", idAz);
    return this.http
      .get(CUSTOM_RESOURCES_BASE_URL + "parametriAziende/search/findByIdApplicazioni", {params: myParams})
      .subscribe(
      res => {
        res["_embedded"].parametroAziendes.forEach(element => {
          this.parametriAzienda.set(element.nome, element.valore);
        });
        // console.log("PARAMETRI = ", this.parametriAzienda);
        }
      );
  }

  /**
   * Restituisce il valore del parametro passato al metodo convertito in boolean
   * @param {string} key Nome del parametro sul database
   * @return {boolean} Il valore boolean del parametro richiesto
  */
  getParametroBooleanByKey(key: string): boolean {
    return this.primitiveToBoolean(this.parametriAzienda.get(key));
  }

  /**
   * Restituisce il valore del parametro passato al metodo
   * @param {string} key Nome del parametro sul database
   * @return {any} Il valore del parametro richiesto
  */
  getParametroByKey(key: string): any {
    return this.parametriAzienda.get(key);
  }

  primitiveToBoolean(value?: string | number | boolean | null): boolean {
    if (value === "true") {
      return true;
    }
  
    return typeof value === "string"
      ? !!+value   // we parse string to number first
      : !!value;
  }
}
