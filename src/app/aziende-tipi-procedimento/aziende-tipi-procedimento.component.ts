import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import ODataStore from 'devextreme/data/odata/store';
import { ODATA_STORE_ROOT_URL, odataTipiProcedimentoPath, odataAziendeTipiProcPath } from '../../environments/app.constant';
import {AziendaTipoProcedimento} from '../classi/azienda-tipo-procedimento';
import {DxFormComponent} from 'devextreme-angular';

@Component({
  selector: 'app-aziende-tipi-procedimento',
  templateUrl: './aziende-tipi-procedimento.component.html',
  styleUrls: ['./aziende-tipi-procedimento.component.css']
})
export class AziendeTipiProcedimentoComponent implements OnInit {
public datasource: DataSource ;
public aziendaProcedimento:  AziendaTipoProcedimento = new AziendaTipoProcedimento();

  labelLocation: string;
  readOnly: boolean;
  showColon: boolean;
  minColWidth: number;
  colCount: number;
  width: any;
  @ViewChild(DxFormComponent) myform: DxFormComponent;

  constructor( ) {
    this.labelLocation = 'top';
    this.readOnly = false;
    this.showColon = true;
    this.minColWidth = 300;
    this.colCount = 2;
    this.datasource = this.getTipiProcedimentoSource();
    // this.datasource.load();
    this.datasource.load().done(res => this.test(res));
    // this.aziendaProcedimento = this.datasource['_items'][0];
  }

  test(res) {
    this.aziendaProcedimento = res[0];
  }

  screen(width) {
    return ( width < 700 ) ? 'sm' : 'lg';
  }

  ngOnInit() {
    // this.datasource = this.getTipiProcedimentoSource();
    // this.datasource.load();

  }

  // ngAfterViewInit() {
  //   this.myform.instance.validate()
  // }

  buttonClicked() {
    console.log(this.aziendaProcedimento);
    // Saving data
    this.datasource.store().update(this.aziendaProcedimento.id, this.aziendaProcedimento);
  }

  onFormSubmit(e) {
    console.log(e);
  }

  getTipiProcedimentoSource() {
    return new DataSource({
      store: new ODataStore({
        key: 'id',
        url: ODATA_STORE_ROOT_URL + odataAziendeTipiProcPath,
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
      expand: ['idAzienda'],
      filter: [['idTipoProcedimento.idTipoProcedimento', '=', 1], ['idAzienda.id', '=', 2]],
    });
  }
  //
  // getTipiProcedimentoSource() {
  //   return new DataSource({
  //     store: new ODataStore({
  //       key: 'id',
  //       url: ODATA_STORE_ROOT_URL + odataAziendeTipiProcPath,
  //       // deserializeDates: true,
  //       /*fieldTypes: {
  //        id: 'Int32',
  //        idAfferenzaStruttura: { 'type': 'Date' }
  //        },*/
  //     }),
  //     map: function (item) {
  //       if (item.dataInizioValidita != null) {
  //         item.dataInizioValidita = new Date(item.dataInizioValidita.getTime() - new Date().getTimezoneOffset() * 60000);
  //       }
  //       if (item.dataFineValidita != null) {
  //         item.dataFineValidita = new Date(item.dataFineValidita.getTime() - new Date().getTimezoneOffset() * 60000);
  //       }
  //       console.log('item', item);
  //       return item;
  //     }
  //   });
  // }
}
