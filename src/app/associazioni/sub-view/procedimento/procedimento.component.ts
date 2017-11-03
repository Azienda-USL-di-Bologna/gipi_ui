import { Component, OnInit } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import ODataStore from 'devextreme/data/odata/store';
import { ODATA_BASE_URL, odataTipiProcedimentoPath, odataAziendeTipiProcPath } from '../../../../environments/app.constants';
import { TipoProcedimento } from '../../../classi/entities/tipo-procedimento';
import { AziendaTipoProcedimento } from '../../../classi/entities/azienda-tipo-procedimento';

@Component({
  selector: 'app-procedimento',
  templateUrl: './procedimento.component.html',
  styleUrls: ['./procedimento.component.css']
})
export class ProcedimentoComponent implements OnInit {

  mode : string = 'VISUAL-MODE';
  procedimento : TipoProcedimento;
  dataSource : DataSource;

  constructor() {
    this.procedimento = new TipoProcedimento();
    this.procedimento.descrizioneTipoProcedimentoDefault = 'descrizione a caso';
    this.procedimento.modoApertura = 'questo è il modo apertura';
    this.procedimento.normaRiferimento = 'norma 99/2a';
    this.procedimento.durataMassimaSospensione = '22';
    this.procedimento.dataInizioValidita = new Date();
    this.procedimento.dataFineValidita = new Date();
  }

  getTipiProcedimentoSource() {
     this.dataSource = new DataSource({
      store: new ODataStore({
        key: 'id',
        url: ODATA_BASE_URL + odataAziendeTipiProcPath,
        // deserializeDates: true,
        /*fieldTypes: {
         id: 'Int32',
         idAfferenzaStruttura: { 'type': 'Date' }
         },*/

      }),
      map: function (item) {
        if (item.dataInizioValidita != null) {
          item.dataInizioValidita = new Date(item.dataInizioValidita.getTime() - new Date().getTimezoneOffset() * 60000);
        }
        if (item.dataFineValidita != null) {
          item.dataFineValidita = new Date(item.dataFineValidita.getTime() - new Date().getTimezoneOffset() * 60000);
        }
        if (item.idAzienda != null) {
          item.nomeAzienda = item.idAzienda.descrizione;
        }
        // console.log('item', item);
        // aziendaTipoProcedimento = new AziendaTipoProcedimento()[1];

        // aziendaTipoProcedimento = item;
        // console.log(aziendaTipoProcedimento);
        return item;
      },
      expand: ['idAzienda', 'idTipoProcedimento', 'idTitolo'],
      filter: [['idTipoProcedimento.idTipoProcedimento', '=', 1], ['idAzienda.id', '=', 2]],
    });
    this.dataSource.load().done(res => console.log(res));
    // console.log(this.dataSource);
  }

  insertTipoProcedimento(procedimento : TipoProcedimento) {
    // let aziendaProcedimento : AziendaTipoProcedimento = new AziendaTipoProcedimento();
    // aziendaProcedimento.idTipoProcedimento = 3;
    // aziendaProcedimento.idAzienda = 7;
    let dataStore :ODataStore = this.dataSource.store() as ODataStore;
    dataStore.insert(procedimento);
  }

  updateTipoProcedimento(key : number, procedimento : TipoProcedimento){
    let dataStore :ODataStore = this.dataSource.store() as ODataStore;
    dataStore.update(key, procedimento);
  }

  removeTipoProcedimento(key : number,){
    let dataStore :ODataStore = this.dataSource.store() as ODataStore;
    dataStore.remove(key);
  }

  public annulla() {
    
  }
  ngOnInit() {
  }

  switchMode(){
    // console.log('switch')
    this.mode = 'EDIT-MODE';
  }

}
