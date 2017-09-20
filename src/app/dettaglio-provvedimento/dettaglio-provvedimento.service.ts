import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';

@Injectable()
export class DettaglioProvvedimentoService {

  private _http: Http;
  private headers: Headers;

  constructor(private http: Http) {
    this._http = http;
    this.headers = new Headers({ "Content-Type": "application/json" });
    this.headers.append('Access-Control-Allow-Headers', 'Content-Type');
    this.headers.append('Access-Control-Allow-Origin', '*');
    this.headers.append('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
  }

  getDettaglioTipoProcedimento(idTipoProcedimento){
    this._http.get('');
  }

}
