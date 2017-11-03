import {Component, OnInit, ViewChild, AfterViewInit, Input} from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import { Router } from '@angular/router';
import {AziendaTipoProcedimento} from '../classi/entities/azienda-tipo-procedimento';
import {DxFormComponent} from 'devextreme-angular';
import {TipoProcedimento} from '../classi/entities/tipo-procedimento';
import { SharedData } from '../classi/context/shared-data';
import {OdataContextDefinition} from "../classi/context/odata-context-definition";
import {Entities} from "../classi/context/context-utils";
import {Azienda} from "../classi/entities/azienda";
import notify from 'devextreme/ui/notify';

@Component({
    selector: 'app-aziende-tipi-procedimento',
    templateUrl: './aziende-tipi-procedimento.component.html',
    styleUrls: ['./aziende-tipi-procedimento.component.css']
})
export class AziendeTipiProcedimentoComponent implements OnInit {

    @Input() tipoProcedimento: TipoProcedimento;
    private datasource: DataSource;
    private nuovaAssociazione: boolean;
    private dataFromDettaglioProcedimentoComponent;
    public aziendaTipoProcedimento: AziendaTipoProcedimento = new AziendaTipoProcedimento();


    // settaggio variabili per impaginazione dati del form
    labelLocation: string;
    readOnly: boolean;
    showColon: boolean;
    minColWidth: number;
    maxColWidth: number;
    colCount: number;
    width: any;

    // Variabili per FormLook dei pulsanti
    testoBottoneConferma: string;
    disabilitaBottoneAssocia: boolean;
    disabilitaBottoneDisassocia: boolean;
    
    statusPage: string;

    testoHeaderTipoProcedimento: string = "testo tipo procedimento passato da Fay";
    testoHeaderAzienda: string = "Nome azienda passato da fay";

    @ViewChild(DxFormComponent) myform: DxFormComponent;

    constructor(private sharedData: SharedData, private odataContextDefinition: OdataContextDefinition, private router: Router) {

        this.testoBottoneConferma = "Conferma";
        this.disabilitaBottoneAssocia = false;
        this.disabilitaBottoneDisassocia = false;

        this.labelLocation = 'left';
        this.readOnly = false;
        this.showColon = true;
        this.minColWidth = 100;
        this.maxColWidth = 200;
        this.colCount = 1;
        this.datasource = new DataSource({
            store: this.odataContextDefinition.getContext()[Entities.AziendaTipoProcedimento],
            expand: ['idAzienda', 'idTipoProcedimento', 'idTitolo'],
            //filter: [['idTipoProcedimento.idTipoProcedimento', '=', this.sharedData.getSharedObject().procedimento.idTipoProcedimento], ['idAzienda.id', '=', this.sharedData.getSharedObject().azienda.id]],
        });
        // this.datasource = new DataSource({
        //     store: new ODataStore({
        //         url: "http://localhost:10006/gipi/odata.svc/AziendaTipoProcedimentos",
        //         key: "id",
        //         keyType: "Int32"
        //     }),
        //     expand: ['idAzienda', 'idTipoProcedimento', 'idTitolo'],
        // });
        // this.datasource.load();
        this.setDataFromDettaglioProcedimentoComponent();
        this.setNuovaAssociazione();
        this.buildAziendaTipoProcedimento();

        //LE INFO NECESSARIE A POPOLARE QUESTI DUE HEADER VENGONO SCRITTE NELLO SharedData DALLA VIDEATA dettaglio-provvedimento


        // this.datasource.load();
        // this.datasource.load().done(res => this.buildAziendaTipoProcedimento(res));
        // this.datasource.store().update("key", this.aziendaProcedimento);
        // this.datasource.store().insert(this.aziendaProcedimento);
        // this.aziendaProcedimento = this.datasource['_items'][0];
    }

    private setDataFromDettaglioProcedimentoComponent() {
        this.dataFromDettaglioProcedimentoComponent = this.sharedData.getSharedObject()["DettaglioProvvedimentoComponent"];
    }

    private setNuovaAssociazione() {
        this.nuovaAssociazione = !this.dataFromDettaglioProcedimentoComponent["aziendaAssociata"];
    }

    public buildAziendaTipoProcedimento() {
        const azienda:Azienda = this.dataFromDettaglioProcedimentoComponent["azienda"];
        const tipoProcedimentoDefault:TipoProcedimento = this.dataFromDettaglioProcedimentoComponent["tipoProcedimento"];
        if (this.nuovaAssociazione) {
            this.aziendaTipoProcedimento.descrizioneTipoProcedimento = tipoProcedimentoDefault.descrizioneTipoProcedimentoDefault;
            this.aziendaTipoProcedimento.durataMassimaSospensione = tipoProcedimentoDefault.durataMassimaSospensione;
            this.aziendaTipoProcedimento.obbligoEsitoConclusivo = false;
            this.aziendaTipoProcedimento.idAzienda = azienda;
            this.aziendaTipoProcedimento.idTipoProcedimento = tipoProcedimentoDefault;
            this.setHeaders();
        }
        else {
            this.datasource.filter([
                ["idTipoProcedimento.idTipoProcedimento", "=", tipoProcedimentoDefault.idTipoProcedimento],
                ["idAzienda.id", "=", azienda.id]]);
            this.datasource.load().done(res => {
                this.aziendaTipoProcedimento = res[0];
                this.setHeaders();
            });
            console.log("loaded", this.datasource.isLoaded())

        }
    }


    screen(width) {
        return (width < 700) ? 'sm' : 'lg';
    }


    ngOnInit() {
    }

    public buttonChiudiClicked(event) {
        // Saving data
        // this.datasource.store().update(this.aziendaProcedimento.id, this.aziendaProcedimento);
        this.router.navigate(["/app-dettaglio-provvedimento"]);
    }

    public buttonConfermaClicked(event) {
        // Saving data
        if (this.nuovaAssociazione) {
            this.statusPage = "insert-status";
            this.datasource.store().insert(this.aziendaTipoProcedimento).done(res => {this.buildAziendaTipoProcedimento()});
            this.nuovaAssociazione = false;
        }
        else {
            this.statusPage = "modify-status";
            this.datasource.store().update(this.aziendaTipoProcedimento.id, this.aziendaTipoProcedimento);
        }
        // notify("salvataggio effettuato con successo", "success", 600);
        notify( {
            message: "salvataggio effettuato con successo",
            type: "success",
            displayTime: 1200,
            position: {
                my: "bottom",
                at: "top",
                of: "#responsive-box-buttons"
            }
        });
    }

    public buttonClicked3(event) {
        console.log(sessionStorage.getItem('gdm'));
        console.log(localStorage.getItem('gdm'));
        // Saving data
        // this.datasource.store().update(this.aziendaProcedimento.id, this.aziendaProcedimento);
        this.statusPage = "delete-status";
    }

    public buttonClicked4(event) {
        console.log(sessionStorage.getItem('gdm'));
        console.log(localStorage.getItem('gdm'));
        // Saving data
        // this.datasource.store().update(this.aziendaProcedimento.id, this.aziendaProcedimento);
    }

    onFormSubmit(e) {
        console.log(e);
    }

    private setHeaders() {
        this.testoHeaderTipoProcedimento = this.aziendaTipoProcedimento.idTipoProcedimento.nomeTipoProcedimento;
        this.testoHeaderAzienda = this.aziendaTipoProcedimento.idAzienda.descrizione;
     }

    getTipiProcedimentoSource() {
        console.log(this.sharedData);
        return new DataSource({
            store: this.odataContextDefinition[Entities.AziendaTipoProcedimento],
//             map: function(item) {
//
// /*                if (item.dataInizioValidita != null) {
//                     item.dataInizioValidita = new Date(item.dataInizioValidita.getTime() - new Date().getTimezoneOffset() * 60000);
//                 }
//                 if (item.dataFineValidita != null) {
//                     item.dataFineValidita = new Date(item.dataFineValidita.getTime() - new Date().getTimezoneOffset() * 60000);
//                 }*/
//                 if (item.idAzienda != null) {
//                     item.nomeAzienda = item.idAzienda.descrizione;
//                 }
//                 return item;
//             },
            expand: ['idAzienda', 'idTipoProcedimento', 'idTitolo'],
            filter: [['idTipoProcedimento.idTipoProcedimento', '=', this.sharedData.getSharedObject().procedimento.idTipoProcedimento], ['idAzienda.id', '=', this.sharedData.getSharedObject().azienda.id]],
        });
    }
    
}
