import {Component, OnInit, ViewChild, AfterViewInit, Input} from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import ODataStore from 'devextreme/data/odata/store';
import { ODATA_STORE_ROOT_URL, odataTipiProcedimentoPath, odataAziendeTipiProcPath } from '../../environments/app.constant';
import {AziendaTipoProcedimento} from '../classi/azienda-tipo-procedimento';
import {DxFormComponent} from 'devextreme-angular';
import {TipoProcedimento} from '../classi/tipo-procedimento';

@Component({
  selector: 'app-aziende-tipi-procedimento',
  templateUrl: './aziende-tipi-procedimento.component.html',
  styleUrls: ['./aziende-tipi-procedimento.component.css']
})
export class AziendeTipiProcedimentoComponent implements OnInit {
  @Input() tipoProcedimento: TipoProcedimento;
public datasource: DataSource ;
public aziendaProcedimento:  AziendaTipoProcedimento = new AziendaTipoProcedimento();

public descrizioneFieldName: string;
public durataMassimaSospensioneFieldName: string;


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
    this.colCount = 1;
    this.datasource = this.getTipiProcedimentoSource();
    // this.datasource.load();
    this.datasource.load().done(res => this.buildAziendaTipoProcedimento(res));
    // this.aziendaProcedimento = this.datasource['_items'][0];
  }

  buildAziendaTipoProcedimento(res) {
    this.aziendaProcedimento = res[0];
    this.aziendaProcedimento.descrizioneTipoProcedimento ?
        this.descrizioneFieldName = 'descrizioneTipoProcedimento' : this.descrizioneFieldName = 'idTipoProcedimento.descrizioneTipoProcedimentoDefault';

    this.aziendaProcedimento.durataMassimaSospensione ?
        this.durataMassimaSospensioneFieldName = 'durataMassimaSospensione' : this.durataMassimaSospensioneFieldName = 'idTipoProcedimento.durataMassimaSospensione';
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
    console.log(sessionStorage.getItem('gdm'));
    console.log(localStorage.getItem('gdm'));
    // Saving data
    // this.datasource.store().update(this.aziendaProcedimento.id, this.aziendaProcedimento);

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
      expand: ['idAzienda', 'idTipoProcedimento', 'idTitolo'],
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
