import {Component, OnInit, ViewChild, AfterViewInit, Input} from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import { Router } from '@angular/router';
import {AziendaTipoProcedimento} from '../classi/entities/azienda-tipo-procedimento';
import {DxFormComponent} from 'devextreme-angular';
import {TipoProcedimento} from '../classi/entities/tipo-procedimento';
import { SharedData } from '../classi/context/shared-data';
import {OdataContextDefinition} from "../classi/context/odata-context-definition";
import {Azienda} from "../classi/entities/azienda";
import notify from 'devextreme/ui/notify';
import {Entities} from "../../environments/app.constants";
import {FormGroup} from "@angular/forms";
import {Entity} from "../classi/context/entity";
import {Titolo} from "../classi/entities/titolo";
import {custom} from "devextreme/ui/dialog";

@Component({
    selector: 'app-aziende-tipi-procedimento',
    templateUrl: './aziende-tipi-procedimento.component.html',
    styleUrls: ['./aziende-tipi-procedimento.component.css']
})
export class AziendeTipiProcedimentoComponent implements OnInit {

    @Input() tipoProcedimento: TipoProcedimento;
    private datasource: DataSource;
    public nuovaAssociazione: boolean;
    private dataFromDettaglioProcedimentoComponent;
    public aziendaTipoProcedimento: AziendaTipoProcedimento = new AziendaTipoProcedimento();
    public initialAziendaTipoProcedimento: AziendaTipoProcedimento;

    public a:Titolo = new Titolo();

    // settaggio variabili per impaginazione dati del form
    labelLocation: string;
    readOnly: boolean;
    showColon: boolean;
    minColWidth: number;
    maxColWidth: number;
    colCount: number;
    width: any;

    // Variabili per FormLook dei pulsanti
    public testoBottoneAnnulla: string = "Indietro";
    public testoBottoneConferma: string;
    public abilitaAnnulla: boolean = false;
    public abilitaBottoneAssocia: boolean;
    public abilitaBottoneDisassocia: boolean;
    public nomeTitolo: string;
    
    statusPage: string;

    testoHeaderTipoProcedimento: string = "testo tipo procedimento passato da Fay";
    testoHeaderAzienda: string = "Nome azienda passato da fay";

    @ViewChild(DxFormComponent) myform: DxFormComponent;

    constructor(private sharedData: SharedData, private odataContextDefinition: OdataContextDefinition, private router: Router) {

        this.labelLocation = 'left';
        this.readOnly = false;
        this.showColon = true;
        this.minColWidth = 100;
        this.maxColWidth = 200;
        this.colCount = 1;
        this.datasource = new DataSource({
            store: this.odataContextDefinition.getContext()[Entities.AziendaTipoProcedimento.name]
                .on("modifying", () => {console.log("modified")})
                .on("modified", () => {console.log("modified")}),
            expand: ['idAzienda', 'idTipoProcedimento', 'idTitolo'],
            //filter: [['idTipoProcedimento.idTipoProcedimento', '=', this.sharedData.getSharedObject().procedimento.idTipoProcedimento], ['idAzienda.id', '=', this.sharedData.getSharedObject().azienda.id]],
        });
        this.setDataFromDettaglioProcedimentoComponent();
        this.setNuovaAssociazione();
        this.buildAziendaTipoProcedimento(true);

        //LE INFO NECESSARIE A POPOLARE QUESTI DUE HEADER VENGONO SCRITTE NELLO SharedData DALLA VIDEATA dettaglio-provvedimento
    }

    ngOnInit() {
    }

    setInitialValues() {
        console.log("onInitialized");
        this.initialAziendaTipoProcedimento = Object.assign({}, this.aziendaTipoProcedimento);
    }

    screen(width) {
        return (width < 700) ? 'sm' : 'lg';
    }

    /**
     * Legge i dati passatti dall'interfaccia precedente DettaglioProvvedimentoComponent
     */
    private setDataFromDettaglioProcedimentoComponent() {
        this.dataFromDettaglioProcedimentoComponent = this.sharedData.getSharedObject()["DettaglioProvvedimentoComponent"];
    }

    /**
     * Dai dati letti dall'interfaccia precedente, estrae il campo "aziendaAssociata" che indica se si tratta di una nuova associazione
     * e lo setta nella varibile di classe apposita "nuovaAssociazione"
     */
    private setNuovaAssociazione() {
        this.nuovaAssociazione = !this.dataFromDettaglioProcedimentoComponent["aziendaAssociata"];
    }

    public buildAziendaTipoProcedimento(setInitialValues: boolean) {
        const azienda:Azienda = this.dataFromDettaglioProcedimentoComponent["azienda"];
        const tipoProcedimentoDefault:TipoProcedimento = this.dataFromDettaglioProcedimentoComponent["tipoProcedimento"];
        if (this.nuovaAssociazione) {
            this.aziendaTipoProcedimento.descrizioneTipoProcedimento = tipoProcedimentoDefault.descrizioneTipoProcedimentoDefault;
            this.aziendaTipoProcedimento.durataMassimaSospensione = tipoProcedimentoDefault.durataMassimaSospensione;
            this.aziendaTipoProcedimento.obbligoEsitoConclusivo = false;
            this.aziendaTipoProcedimento.idAzienda = azienda;
            this.aziendaTipoProcedimento.idTipoProcedimento = tipoProcedimentoDefault;
            this.setFields(tipoProcedimentoDefault);
            if (setInitialValues) {
                this.setInitialValues();
            }
        }
        else {
            this.datasource.filter([
                ["idTipoProcedimento.idTipoProcedimento", "=", tipoProcedimentoDefault.idTipoProcedimento],
                ["idAzienda.id", "=", azienda.id]]);
            this.datasource.load().done(res => {
                // this.aziendaTipoProcedimento = res[0] as AziendaTipoProcedimento;
                this.aziendaTipoProcedimento.build(res[0], AziendaTipoProcedimento);
                this.setFields(tipoProcedimentoDefault);
                if (setInitialValues) {
                    this.setInitialValues();
                }
            });
        }
    }

    private setFields(tipoProcedimentoDefault: TipoProcedimento) {
        this.testoBottoneConferma = "Conferma";
        this.abilitaBottoneAssocia = this.nuovaAssociazione;
        this.abilitaBottoneDisassocia = !this.abilitaBottoneAssocia;

        this.testoHeaderTipoProcedimento = this.aziendaTipoProcedimento.idTipoProcedimento.nomeTipoProcedimento;
        this.testoHeaderAzienda = this.aziendaTipoProcedimento.idAzienda.descrizione;
        this.aziendaTipoProcedimento["modoApertura"] = tipoProcedimentoDefault.modoApertura;
        this.aziendaTipoProcedimento["normaRiferimento"] = tipoProcedimentoDefault.normaRiferimento;
        if (this.aziendaTipoProcedimento.idTitolo)
            this.nomeTitolo = this.aziendaTipoProcedimento.idTitolo.nomeTitolo
        //     this.aziendaTipoProcedimento["nomeTitolo"] = this.aziendaTipoProcedimento.idTitolo.nomeTitolo
    }

    public formFieldDataChanged(event) {
        console.log("dataChanged: ", Entity.isEquals(this.aziendaTipoProcedimento, this.initialAziendaTipoProcedimento));
        this.abilitaAnnulla = !Entity.isEquals(this.aziendaTipoProcedimento, this.initialAziendaTipoProcedimento);
        if (this.abilitaAnnulla)
            this.testoBottoneAnnulla = "Annulla";
        else
            this.testoBottoneAnnulla = "Indietro"
    }

    public buttonAnnullaClicked(event) {
        if (this.abilitaAnnulla) {
            const confirmDialog = custom(
                {
                    title: "Annullare?",
                    message: "Annullare le modifiche e tornare indetro?",
                    buttons: [{
                        text: "Si", onClick: function () {
                            return "Si";
                        }
                    }, {
                        text: "No", onClick: function () {
                            return "No";
                        }
                    }]
                });
            confirmDialog.show().done(
                dialogResult => {
                    if (dialogResult === "Si") {
                        this.router.navigate(["/app-dettaglio-provvedimento"]);
                    }
                });
        }
        else {
            this.router.navigate(["/app-dettaglio-provvedimento"]);
        }
        // Saving data
        // this.datasource.store().update(this.aziendaProcedimento.id, this.aziendaProcedimento);
    }

    public buttonConfermaClicked(event) {
        // Saving data
        if (this.nuovaAssociazione) {
            this.statusPage = "insert-status";
            this.datasource.store().insert(this.aziendaTipoProcedimento).done(res => {this.buildAziendaTipoProcedimento(true)});
            this.nuovaAssociazione = false;
        }
        else {
            this.statusPage = "modify-status";
            // this.datasource.store().update(this.aziendaTipoProcedimento.id, this.aziendaTipoProcedimento).done(res => (this.setFields(this.dataFromDettaglioProcedimentoComponent["tipoProcedimento"])));
            this.datasource.store().update(this.aziendaTipoProcedimento.id, this.aziendaTipoProcedimento).done(res => (this.buildAziendaTipoProcedimento(true)));
        }
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

    public buttonDisassociaClicked(event) {
        console.log(this.initialAziendaTipoProcedimento);
        console.log(this.aziendaTipoProcedimento);

        if (Entity.isEquals(this.aziendaTipoProcedimento, this.initialAziendaTipoProcedimento)) {
            console.log("UGUALI");
        } else {
            console.log("DIVERSI");
        }
        this.statusPage = "delete-status";
    }



    public buttonAssociaClicked(event) {
        console.log(sessionStorage.getItem('gdm'));
        console.log(localStorage.getItem('gdm'));
    }

    onFormSubmit(e) {
        console.log(e);
    }
}
