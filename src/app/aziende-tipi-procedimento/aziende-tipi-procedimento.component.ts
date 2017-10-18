import {Component, OnInit, ViewChild, AfterViewInit, Input} from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import ODataStore from 'devextreme/data/odata/store';
import { ODATA_STORE_ROOT_URL, odataTipiProcedimentoPath, odataAziendeTipiProcPath } from '../../environments/app.constant';
import {AziendaTipoProcedimento} from '../classi/azienda-tipo-procedimento';
import {DxFormComponent} from 'devextreme-angular';
import {TipoProcedimento} from '../classi/tipo-procedimento';
import { SharedData } from '../classi/context/shared-data';

@Component({
    selector: 'app-aziende-tipi-procedimento',
    templateUrl: './aziende-tipi-procedimento.component.html',
    styleUrls: ['./aziende-tipi-procedimento.component.css']
})
export class AziendeTipiProcedimentoComponent implements OnInit {

    @Input() tipoProcedimento: TipoProcedimento;
    datasource: DataSource;
    descrizioneFieldName: string;
    durataMassimaSospensioneFieldName: string;
    aziendaProcedimento: AziendaTipoProcedimento = new AziendaTipoProcedimento();


    // settaggio variabili per impaginazione dati del form
    labelLocation: string;
    readOnly: boolean;
    showColon: boolean;
    minColWidth: number;
    maxColWidth: number;
    colCount: number;
    width: any;

    //Variabili per FormLook dei pulsanti
    testoBottoneConferma: string;
    disabilitaBottoneAssocia: boolean;
    disabilitaBottoneDisassocia: boolean;
    
    statusPage: string;

    testoHeaderTipoProcedimento: string = "testo tipo procedimento passato da Fay";
    testoHeaderAzienda: string = "Nome azienda passato da fay";

    @ViewChild(DxFormComponent) myform: DxFormComponent;

    constructor(private sharedData: SharedData) {

        this.testoBottoneConferma = "Conferma";
        this.disabilitaBottoneAssocia = false;
        this.disabilitaBottoneDisassocia = false;

        //LE INFO NECESSARIE A POPOLARE QUESTI DUE HEADER VENGONO SCRITTE NELLO SharedData DALLA VIDEATA dettaglio-provvedimento
        this.testoHeaderTipoProcedimento = this.getDescrizioneTipoProcedimento();
        this.testoHeaderAzienda = this.sharedData.getSharedObject().azienda.descrizione;
        
        this.labelLocation = 'left';
        this.readOnly = false;
        this.showColon = true;
        this.minColWidth = 100;
        this.maxColWidth = 200;
        this.colCount = 1;
        this.datasource = this.getTipiProcedimentoSource();
        // this.datasource.load();
        this.datasource.load().done(res => this.buildAziendaTipoProcedimento(res));
        // this.aziendaProcedimento = this.datasource['_items'][0];
    }

    buildAziendaTipoProcedimento(res) {
        this.aziendaProcedimento = res[0];
        //debugger;
        
        /*this.aziendaProcedimento.descrizioneTipoProcedimento ?
            this.descrizioneFieldName = 'descrizioneTipoProcedimento' : this.descrizioneFieldName = 'idTipoProcedimento.descrizioneTipoProcedimentoDefault';

        this.aziendaProcedimento.durataMassimaSospensione ?
            this.durataMassimaSospensioneFieldName = 'durataMassimaSospensione' : this.durataMassimaSospensioneFieldName = 'idTipoProcedimento.durataMassimaSospensione';*/
    }

    screen(width) {
        return (width < 700) ? 'sm' : 'lg';
    }


    ngOnInit() {
    }

    buttonClicked1() {
        // Saving data
        // this.datasource.store().update(this.aziendaProcedimento.id, this.aziendaProcedimento);
        this.statusPage = "insert-status";
        console.log(this.sharedData.getSharedObject());
    }

    buttonClicked2() {
        // Saving data
        // this.datasource.store().update(this.aziendaProcedimento.id, this.aziendaProcedimento);
        this.statusPage = "modify-status";
    }

    buttonClicked3() {
        console.log(sessionStorage.getItem('gdm'));
        console.log(localStorage.getItem('gdm'));
        // Saving data
        // this.datasource.store().update(this.aziendaProcedimento.id, this.aziendaProcedimento);
        this.statusPage = "delete-status";
    }

    buttonClicked4() {
        console.log(sessionStorage.getItem('gdm'));
        console.log(localStorage.getItem('gdm'));
        // Saving data
        // this.datasource.store().update(this.aziendaProcedimento.id, this.aziendaProcedimento);
    }

    onFormSubmit(e) {
        console.log(e);
    }

    getDescrizioneTipoProcedimento(): string { 
          return this.sharedData.getSharedObject().procedimento.nomeTipoProcedimento ?
              this.sharedData.getSharedObject().procedimento.nomeTipoProcedimento :
              this.sharedData.getSharedObject().procedimento.descrizioneTipoProcedimentoDefault;
     }

    getTipiProcedimentoSource() {
        console.log(this.sharedData);
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
            map: function(item) {
                
                if (item.dataInizioValidita != null) {
                    item.dataInizioValidita = new Date(item.dataInizioValidita.getTime() - new Date().getTimezoneOffset() * 60000);
                }
                if (item.dataFineValidita != null) {
                    item.dataFineValidita = new Date(item.dataFineValidita.getTime() - new Date().getTimezoneOffset() * 60000);
                }
                if (item.idAzienda != null) {
                    item.nomeAzienda = item.idAzienda.descrizione;
                }
                return item;
            },
            expand: ['idAzienda', 'idTipoProcedimento', 'idTitolo'],
            filter: [['idTipoProcedimento.idTipoProcedimento', '=', this.sharedData.getSharedObject().procedimento.idTipoProcedimento], ['idAzienda.id', '=', this.sharedData.getSharedObject().azienda.id]],
        });
    }
    
}
