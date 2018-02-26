import {Component, OnInit, ViewChild, AfterViewInit, Input} from "@angular/core";
import DataSource from "devextreme/data/data_source";
import { Router } from "@angular/router";
import {AziendaTipoProcedimento, TipoProcedimento, Azienda, Titolo} from "@bds/nt-entities";
import {DxFormComponent} from "devextreme-angular";
import {OdataContextDefinition} from "@bds/nt-context";
import notify from "devextreme/ui/notify";
import {Entity} from "@bds/nt-context";
import {custom} from "devextreme/ui/dialog";
import {OdataContextFactory} from "@bds/nt-context";
import { CustomLoadingFilterParams } from "@bds/nt-context";
import {GlobalContextService} from "@bds/nt-context";
import {ButtonAppearance} from "@bds/nt-context/templates/buttons-bar/buttons-bar.component";


@Component({
    selector: "app-gestione-associazione-azienda",
    templateUrl: "./gestione-associazione-azienda.component.html",
    styleUrls: ["./gestione-associazione-azienda.component.scss"]
})
export class GestioneAssociazioneAziendaComponent implements OnInit {
    private odataContextEntitiesAziendaTipoProcedimento: OdataContextDefinition;
    private dataFromDettaglioProcedimentoComponent;
    private datasource: DataSource;

    @Input() public tipoProcedimento: TipoProcedimento;
    @ViewChild(DxFormComponent) public myform: DxFormComponent;

    public nuovaAssociazione: boolean;
    public aziendaTipoProcedimento: AziendaTipoProcedimento = new AziendaTipoProcedimento();
    public initialAziendaTipoProcedimento: AziendaTipoProcedimento;
    public dataSourceClassificazione: DataSource;

    // settaggio variabili per impaginazione dati del form
    labelLocation: string;
    readOnly: boolean;
    showColon: boolean;
    minColWidth: number;
    maxColWidth: number;
    colCount: number;
    width: any;

    // Variabili per FormLook dei pulsanti
    public testoBottoneAnnulla = "Indietro";
    public testoBottoneConferma: string;
    public datiModificati = false;
    public abilitaBottoneAssocia: boolean;
    public abilitaBottoneDisassocia: boolean;
    public nomeTitolo: string;

    public backBtn: ButtonAppearance;
    public saveBtn: ButtonAppearance;
    public reloadBtn: ButtonAppearance;
    public restoreBtn: ButtonAppearance;

    public statusPage: string;

    public testoHeaderTipoProcedimento = "testo tipo procedimento passato da Fay";
    public testoHeaderAzienda = "Nome azienda passato da fay";


    constructor(private odataContextFactory: OdataContextFactory,
                private router: Router,
                private globalContextService: GlobalContextService) {

        this.labelLocation = "left";
        this.readOnly = false;
        this.showColon = true;
        this.minColWidth = 100;
        this.maxColWidth = 200;
        this.colCount = 1;

        this.backBtn = new ButtonAppearance("indietro", "back", true, false);
        this.saveBtn = new ButtonAppearance("salva", "save", true, false);
        this.reloadBtn = new ButtonAppearance("refresh", "refresh", true, false);
        this.restoreBtn = new ButtonAppearance("ripristina", "revert", true, false);

        this.odataContextEntitiesAziendaTipoProcedimento = this.odataContextFactory.buildOdataContextEntitiesDefinition();
        this.datasource = new DataSource({
            store: this.odataContextEntitiesAziendaTipoProcedimento.getContext()[new AziendaTipoProcedimento().getName()]
                .on("modifying", () => {console.log("modified"); })
                .on("modified", () => {console.log("modified"); }),
            expand: ["idAzienda", "idTipoProcedimento", "idTitolo"],
            // filter: [['idTipoProcedimento.idTipoProcedimento', '=', this.sharedData.getSharedObject().procedimento.idAziendaTipoProcedimento], ['idAzienda.id', '=', this.sharedData.getSharedObject().azienda.id]],
        });
        this.setDataFromAssociazioneAziendeComponent();
        this.setNuovaAssociazione();
        this.buildAziendaTipoProcedimento(true);

        const oataContextDefinitionTitolo: OdataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
        const customLoadingFilterParams: CustomLoadingFilterParams = new CustomLoadingFilterParams("nomeTitolo");
        customLoadingFilterParams.addFilter(["tolower(${target})", "contains", "${value.tolower}"]);

        this.dataSourceClassificazione = new DataSource({
            store: oataContextDefinitionTitolo.getContext()[new Titolo().getName()].on("loading", (loadOptions) => {
                loadOptions.userData["customLoadingFilterParams"] = customLoadingFilterParams;
                oataContextDefinitionTitolo.customLoading(loadOptions);
            }),
            filter: [["idAzienda", "=", this.dataFromDettaglioProcedimentoComponent.azienda.id]]
        });
        // this.dataSourceClassificazione.load();

        /*
            this.dataSourceClassificazione = new DataSource({
                store: this.odataContextEntitiesDefinition.getContext()[Entities.Titolo.name],
                filter: [['idAzienda', '=', this.sharedData.getSharedObject()["DettaglioProcedimentoComponent"]["azienda"]["id"]]]
            })
            this.dataSourceClassificazione.load();
        */
        // LE INFO NECESSARIE A POPOLARE QUESTI DUE HEADER VENGONO SCRITTE NELLO SharedData DALLA VIDEATA dettaglio-procedimento
    }


    /**
     * Legge i dati passatti dall'interfaccia precedente DettaglioProcedimentoComponent
     */
    private setDataFromAssociazioneAziendeComponent() {
        this.dataFromDettaglioProcedimentoComponent = this.globalContextService.getInnerSharedObject("AssociazioneAziendeComponent");

        // this.dataFromDettaglioProcedimentoComponent = this.sharedData.getSharedObject()["DettaglioProcedimentoComponent"];
    }

    /**
     * Dai dati letti dall'interfaccia precedente, estrae il campo "aziendaAssociata" che indica se si tratta di una nuova associazione
     * e lo setta nella varibile di classe apposita "nuovaAssociazione"
     */
    private setNuovaAssociazione() {
        this.nuovaAssociazione = !this.dataFromDettaglioProcedimentoComponent.aziendaAssociata;
    }

    private setFields(tipoProcedimentoDefault: TipoProcedimento) {
        this.testoBottoneConferma = "Conferma";
        this.abilitaBottoneAssocia = this.nuovaAssociazione;
        this.abilitaBottoneDisassocia = !this.abilitaBottoneAssocia;

        this.testoHeaderTipoProcedimento = this.aziendaTipoProcedimento.idTipoProcedimento.nome;
        this.testoHeaderAzienda = this.aziendaTipoProcedimento.idAzienda.descrizione;
        this.aziendaTipoProcedimento["modoApertura"] = tipoProcedimentoDefault.modoApertura;
        this.aziendaTipoProcedimento["normaRiferimento"] = tipoProcedimentoDefault.normaRiferimento;
        if (this.aziendaTipoProcedimento.idTitolo)
            this.nomeTitolo = this.aziendaTipoProcedimento.idTitolo.nome;
        //     this.aziendaTipoProcedimento["nomeTitolo"] = this.aziendaTipoProcedimento.idTitolo.nomeTitolo
    }

    ngOnInit() {
    }

    setInitialValues() {
        console.log("onInitialized");
        this.initialAziendaTipoProcedimento = Object.assign({}, this.aziendaTipoProcedimento);
    }

    screen(width) {
        return (width < 700) ? "sm" : "lg";
    }

    public buildAziendaTipoProcedimento(setInitialValues: boolean) {
        const azienda: Azienda = this.dataFromDettaglioProcedimentoComponent["azienda"];
        const tipoProcedimentoDefault: TipoProcedimento = this.dataFromDettaglioProcedimentoComponent["tipoProcedimento"];
        if (this.nuovaAssociazione) {
            this.restoreBtn.disabled = true;
            this.aziendaTipoProcedimento.descrizioneTipoProcedimento = tipoProcedimentoDefault.descrizioneDefault;
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
            this.restoreBtn.disabled = false;
            this.datasource.filter([
                ["idTipoProcedimento.id", "=", tipoProcedimentoDefault.id],
                ["idAzienda.id", "=", azienda.id]]);
            this.datasource.load().then(res => {
                // this.aziendaTipoProcedimento = res[0] as AziendaTipoProcedimento;
                // this.aziendaTipoProcedimento.build(res[0], AziendaTipoProcedimento);
                this.aziendaTipoProcedimento.build(res[0]);
                this.setFields(tipoProcedimentoDefault);
                if (setInitialValues) {
                    this.setInitialValues();
                }
            });
        }
    }

    public formFieldDataChanged(event) {
        console.log("dataChanged: ", Entity.isEquals(this.aziendaTipoProcedimento, this.initialAziendaTipoProcedimento));
        console.log("Event object: ", event);
        this.datiModificati = !Entity.isEquals(this.aziendaTipoProcedimento, this.initialAziendaTipoProcedimento);
        // if (this.datiModificati)
        //     this.testoBottoneAnnulla = "Annulla";
        // else
        //     this.testoBottoneAnnulla = "Indietro";
    }

    public buttonAnnullaClicked(event) {
        if (this.datiModificati) {
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
                        this.router.navigate(["/associazione-aziende"]);
                    }
                });
        }
        else {
            this.router.navigate(["/associazione-aziende"]);
        }
        // Saving data
        // this.datasource.store().update(this.aziendaProcedimento.id, this.aziendaProcedimento);
    }

    public buttonConfermaClicked(event) {
        // Saving data
        if (this.nuovaAssociazione) {
            this.statusPage = "insert-status";
            this.datasource.store().insert(this.aziendaTipoProcedimento).done(res => {this.buildAziendaTipoProcedimento(true); });
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
                of: "#button-row-2"
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
        console.log(sessionStorage.getItem("gdm"));
        console.log(localStorage.getItem("gdm"));
    }

    public buttonVediAssociazioni(azienda) {
        this.router.navigate(["/struttura-tipi-procedimento"], {queryParams: {
            aziendaTipoProcedimento: this.aziendaTipoProcedimento.id,
            azienda: this.aziendaTipoProcedimento.idAzienda.id,
            tipoProcedimento: this.aziendaTipoProcedimento.idTipoProcedimento.nome}});
    }

    public valueTitoloChanged(e) {
        console.log("Value Titolo Changed: ", e);
    }

    public onBack() {
        if (this.datiModificati) {
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
                        this.router.navigate(["/associazione-aziende"]);
                    }
                });
        }
        else {
            this.router.navigate(["/associazione-aziende"]);
        }
        // CustomReuseStrategy.componentsReuseList.push("*");
        // this.router.navigate(["/app-dettaglio-procedimento"]);
    }

    public onReload() {
        console.log("onReload");
        this.buildAziendaTipoProcedimento(true);
    }

    public onSave() {
    }

    public onRestore() {
        this.aziendaTipoProcedimento = Object.assign( {}, this.initialAziendaTipoProcedimento );
    }
}
