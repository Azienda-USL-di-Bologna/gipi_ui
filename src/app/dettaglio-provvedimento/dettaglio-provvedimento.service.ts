import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { odataAziendeTipiProcPath } from '../../environments/app.constant';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

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
    console.log('get of service');
    let requestOptions = new RequestOptions({headers: this.headers});
    let url = 'http://localhost:10006/odata.svc' + odataAziendeTipiProcPath + '?$filter=FK_id_tipo_procedimento eq ' + idTipoProcedimento + '&$expand=idAzienda';
    console.log('url: ', url);
    this.http.get(url).map((response:Response) => {
                console.log(response.json());
                response.json();
            }).subscribe();;
  }

}
