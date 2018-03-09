import {Component, ViewChild, Input, Output, EventEmitter, OnInit} from "@angular/core";
import {DxDataGridComponent} from "devextreme-angular";
import DataSource from "devextreme/data/data_source";
import {OdataContextFactory, OdataContextDefinition} from "@bds/nt-context";
import {Router} from "@angular/router";
import {LoggedUser} from "@bds/nt-login";
import {GlobalContextService} from "@bds/nt-context";
import {UtilityFunctions} from "app/utility-functions";
import {bAzienda, bStruttura, bUtente, Procedimento} from "@bds/nt-entities";
import {forEach} from "@angular/router/src/utils/collection";

@Component({
    selector: "procedimenti-attivi",
    templateUrl: "./procedimenti-attivi.component.html",
    styleUrls: ["./procedimenti-attivi.component.scss"]
})
export class ProcedimentiAttiviComponent implements OnInit {

    private odataContextDefinition: OdataContextDefinition;
    private rigaSelezionata: any;
    private idStruttureUtente: number[];
    private utility: UtilityFunctions = new UtilityFunctions();

    @ViewChild("gridContainer") gridContainer: DxDataGridComponent;
    public idAzienda: number;
    public dataSourceProcedimenti: DataSource;
    public popupButtons: any[];
    public popupNuovoIterVisible: boolean = false;
    public procedimentoDaPassare: any;
    public iterAvviato: boolean = false;
    public idIterAvviato: number;
    public daDocumento: boolean = false;
    public enableSelection: string = "none";
    public colonnaVisibile: boolean = true;
    public showTitle: boolean = true;

    @Input()
    set avviaIterDaDocumento(daDocumento: any) {
        this.daDocumento = daDocumento;
        // this.setDataAvviaIterDaDocumento();
        this.setFormLookAvviaIterDaDocumento();
    }

    @Output("messageEvent") messageEvent = new EventEmitter<any>();

    public loggedUser: LoggedUser;

    constructor(private odataContextFactory: OdataContextFactory,
                public router: Router,
                private globalContextService: GlobalContextService) {
        console.log("file: app/procedimenti-attivi/procedimenti-attivi.components.ts");
        console.log("procedimenti-attivi (constructor)");
        this.initData();
    }

    private initData(): void {
        this.loggedUser = this.globalContextService.getInnerSharedObject("loggedUser");
        this.idAzienda = this.loggedUser.getField(bUtente.aziendaLogin)[bAzienda.id];
        this.idStruttureUtente = this.getIdStruttureUtente();

        // this.idAzienda = JSON.parse(sessionStorage.getItem("userInfoMap")).aziende.id;
        const now = new Date();

        this.odataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
        this.dataSourceProcedimenti = new DataSource({
            store: this.odataContextDefinition.getContext()[new Procedimento().getName()].on("loaded", (res: any) => {
                // for (let i = 0; i < res.length; i++) {
                //     if (i < 100)
                //         res.pop();
                // }
                console.log("res: ", res);
            }),
            // paginate: true,
            // pageSize: 20,
            expand: [
                "idStruttura",
                "idTitolarePotereSostitutivo/idPersona",
                "idStrutturaTitolarePotereSostitutivo",
                "idAziendaTipoProcedimento/idTitolo",
                "idAziendaTipoProcedimento/idTipoProcedimento",
                "idResponsabileAdozioneAttoFinale/idPersona",
                "idStrutturaResponsabileAdozioneAttoFinale"

            ],
            filter: [
                ["idAziendaTipoProcedimento.idAzienda.id", "=", this.idAzienda],
                this.utility.buildMultipleFilterForArray("idStruttura.id", this.idStruttureUtente),
                ["dataInizio", "<=", now],
                [
                    ["dataFine", ">", now],
                    "or",
                    ["dataFine", "=", null]
                ]
            ]/* ,
      map: (item) => {
        console.log(item);
        // item.idAziendaTipoProcedimento.idTitolo.nome += " [" + item.idAziendaTipoProcedimento.idTitolo.classificazione + "]";
        item.descrizioneTitolo =  item.idAziendaTipoProcedimento.idTitolo.nome + " [" + item.idAziendaTipoProcedimento.idTitolo.classificazione + "]";
        return item;
      } */
        });

        this.itemClear = this.itemClear.bind(this);
        this.setFormLookBase();
        this.dataInitialized = true;
    }

    private setDataAvviaIterDaDocumento() {
        // Devo aggiungere il filtro sulle strutture dell'utente
        // Prima mi creo l'array con gli id struttura

        // Ora mi creo l'array-filtro e filtro
        this.dataSourceProcedimenti.filter(
            this.utility.buildMultipleFilterForArray("idStruttura.id", this.idStruttureUtente)
                .concat(this.dataSourceProcedimenti.filter())
        );
    }

    private getIdStruttureUtente(): number[] {
        let idStrutture: number[] = [];
        this.loggedUser.getField(bUtente.struttureAfferenzaDiretta).forEach((struttura: any) => {
            idStrutture.push(struttura[bStruttura.id]);
        });
        if (this.loggedUser.getField(bUtente.struttureAfferenzaFunzionale) != null) {
            this.loggedUser.getField(bUtente.struttureAfferenzaFunzionale).forEach((struttura: any) => {
                idStrutture.push(struttura[bStruttura.id]);
            });
        }
        return idStrutture;
    }

    private setFormLookAvviaIterDaDocumento() {
        this.enableSelection = "single";
        this.colonnaVisibile = false;
        this.showTitle = false;
    }

    private apriDettaglio(row: any) {
        this.gridContainer.instance.editRow(row.rowIndex);
    }

    // Definisco l'aspetto della pagina
    private setFormLookBase() {
        this.popupButtons = [{
            toolbar: "bottom",
            location: "center",
            widget: "dxButton",
            options: {
                type: "normal",
                text: "Chiudi",
                onClick: () => {
                    this.gridContainer.instance.cancelEditData();
                }
            }
        }];
    }

    ngOnInit(): void {
    }

    // Gestisco la toolbar di ricerca. La voglio centrale.
    onToolbarPreparing(e) {
        const toolbarItems = e.toolbarOptions.items;
        const searchPanel = toolbarItems.filter(item => item.name === "searchPanel");

        if (searchPanel && searchPanel[0]) {
            searchPanel[0].location = "center";
        }
    }

    // Calcolo la Width dei widget in base alla grandezza della finestra del browser.
    calcWidth(divisore: number, responsive = false): any {
        if (responsive && window.innerWidth < 1280)
            return "90%";
        return window.innerWidth / divisore;
    }

    // Creo un template per item "puri"
    itemClear(data, itemElement): string {
        const rowData = this.gridContainer.instance.getDataSource().items()[this.rigaSelezionata.rowIndex];
        return data.dataField.split(".").reduce((o, i) => o[i], rowData); // Devo parsare il dataField per entrare in profondità nell'oggetto
    }

    // Aggiungo l'ignore case per tutte le colonne non lookup
    customizeColumns(columns: any) {
        columns.forEach(column => {
            const defaultCalculateFilterExpression = column.calculateFilterExpression;
            column.calculateFilterExpression = function (value, selectedFilterOperation) {
                if (this.dataType === "string" && !this.lookup && value) {
                    return ["tolower(" + this.dataField + ")",
                        selectedFilterOperation || "contains",
                        value.toLowerCase()];
                } else {
                    return defaultCalculateFilterExpression.apply(this, arguments);
                }
            };
        });
    }

    public descrizioneTitolo(item: any): string {
        // non togliere questo if altrimenti capita il caso del loading infinito #RM: https://babelmine-auslbo.avec.emr.it/issues/20360
        if (item && item.idAziendaTipoProcedimento && item.idAziendaTipoProcedimento.idTitolo && item.idAziendaTipoProcedimento.idTitolo.classificazione &&
            item.idAziendaTipoProcedimento.idTitolo.nome
        )
        return "[" + item.idAziendaTipoProcedimento.idTitolo.classificazione + "] " + item.idAziendaTipoProcedimento.idTitolo.nome;
    }

    public receiveMessage(event: any) {
        this.iterAvviato = !!event.idIter;
        if (this.iterAvviato) {
            this.idIterAvviato = event.idIter;
        }
        this.popupNuovoIterVisible = event.visible;
    }

    public popupHidden() {
        this.popupNuovoIterVisible = false; // Settaggio necessario in caso il popup venga chiuso tramite la X
        if (this.iterAvviato) {
            this.iterAvviato = false;
            this.router.navigate(["iter-procedimento"], {queryParams: {idIter: this.idIterAvviato}});
        }
    }

    public handleEvent(name: String, e: any) {
        switch (name) {
            case "infoOnClick":
                this.rigaSelezionata = e.row;
                this.apriDettaglio(e.row);
                break;
            case "iterOnClick":
                this.popupNuovoIterVisible = true;
                this.procedimentoDaPassare = {
                    procedimento: e.row.data
                };
                break;
            case "onSelectionChanged":
                this.messageEvent.emit({row: e});
                break;
        }
    }
}
