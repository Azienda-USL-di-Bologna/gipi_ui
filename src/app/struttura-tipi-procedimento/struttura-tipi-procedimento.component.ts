import { Component, Input, OnInit, ViewChild, SimpleChange, OnChanges, SimpleChanges } from "@angular/core";
import { Location } from "@angular/common";
import DataSource from "devextreme/data/data_source";
import ODataStore from "devextreme/data/odata/store";
import { Router, ActivatedRoute, Params } from "@angular/router";
import {
  OdataContextDefinition, OdataContextFactory, OdataContextEntitiesDefinition,
  Entity, CustomLoadingFilterParams, GlobalContextService, ServerObject
} from "@bds/nt-context";
import {
  Struttura, Procedimento, Utente,
  GetStruttureByTipoProcedimento, UtenteStruttura, AziendaTipoProcedimento
} from "@bds/nt-entities";
import notify from "devextreme/ui/notify";
import { NodeOperations } from "../reusable-component/strutture-tree/strutture-tree.component";
import { confirm } from "devextreme/ui/dialog";
import { HttpClient } from "@angular/common/http";
import { CUSTOM_RESOURCES_BASE_URL } from "environments/app.constants";

@Component({
  selector: "struttura-tipi-procedimento",
  templateUrl: "./struttura-tipi-procedimento.component.html",
  styleUrls: ["./struttura-tipi-procedimento.component.scss"]
})
export class StrutturaTipiProcedimentoComponent implements OnInit {
  private odataContextDefinition: OdataContextDefinition;
  private odataContextDefinitionAzienda: OdataContextDefinition;
  private odataContextDefinitionTitolare: OdataContextDefinition;
  private odataContextDefinitionResponsabile: OdataContextDefinition;
  private odataContextDefinitionProcedimento: OdataContextDefinition;
  private nodeSelectedFromContextMenu: any;
  private initialState: any;
  private dataSourceProcedimento: DataSource;

  private aziendaTipoProcedimento: AziendaTipoProcedimento;

  @ViewChild("treeView") treeView: any;

  public strutturaSelezionata: Struttura;
  public datasource: DataSource;
  public strutture: Struttura = new Struttura();
  public contextMenuItems;

  public nodeInvolved: Object = {};

  public dataSourceResponsabile: DataSource;        // Datasource Utente per il Responsabile dell’adozione dell’atto finale  
  public dataSourceTitolare: DataSource;            // Datasource Utente per il Titolare Postere Sostitutivo

  public procedimento: Procedimento = new Procedimento();
  public initialProcedimento: Procedimento;

  public possoAgireForm = false;



  public headerTipoProcedimento: string;
  public headerStruttura;

  /* Variabili passate all'albero */
  public idAziendaFront: number;
  public idAziendaTipoProcedimentoFront: number;
  public aziendaTipiProcedimentoData: any;  // vedi dove serve

  public defaultResponsabile: UtenteStruttura;
  public defaultTitolare: UtenteStruttura;

  public formVisible = false;
  public popupVisible = false;
  public colCountByScreen = {
    md: 2,
    sm: 1
  };

  public descrizioneDataFields: any =
    {
      "idResponsabileAdozioneAttoFinale": "Responsabile dell\'adozione dell\'atto finale",
      "idTitolarePotereSostitutivo": "Titolare potere sostitutivo",
      "ufficio": "Ufficio",
      "strumenti": "Strumenti di tutela amministrativa e giurisdizionale riconosciuti dalla Legge",
      "modalitaInfo": "Modalità informativa stato iter",
      "descrizioneAtti": "Descrizione atti e documenti da allegare all\'istanza",
      "dataInizio": "Data Inizio",
      "dataFine": "Data Fine",
    };

  public testoTooltipResponsabile: String;
  public testoTooltipTitolare: String;


  constructor(private odataContextFactory: OdataContextFactory,
    private globalContextService: GlobalContextService,
    private router: Router, private activatedRoute: ActivatedRoute,
    private _location: Location,
    private http: HttpClient) {

      console.log("struttura-tipi-procedimento CONSTRUCTOR");

    this.activatedRoute.queryParams.subscribe((queryParams: Params) => {
      this.idAziendaFront = +queryParams["azienda"];
      this.idAziendaTipoProcedimentoFront = +queryParams["aziendaTipoProcedimento"];
      this.headerTipoProcedimento = queryParams["tipoProcedimento"];
    });

    this.strutturaSelezionata = new Struttura();
    // COSTRUZIONE MENU CONTESTUALE SULL'ALBERO
    this.contextMenuItems = [{ text: "Espandi a struttureAfferenzaDiretta figlie" }];

    this.odataContextDefinition = odataContextFactory.buildOdataFunctionsImportDefinition();
    this.odataContextDefinitionTitolare = this.odataContextFactory.buildOdataContextEntitiesDefinition();
    this.odataContextDefinitionResponsabile = this.odataContextFactory.buildOdataContextEntitiesDefinition();
    this.odataContextDefinitionProcedimento = this.odataContextFactory.buildOdataContextEntitiesDefinition();


    const customLoadingFilterParams: CustomLoadingFilterParams = new CustomLoadingFilterParams("descrizione");
    customLoadingFilterParams.addFilter(["tolower(${target})", "contains", "${value.tolower}"]);

  }


  private caricaDettaglioProcedimento() {

    /*     if (selectedNode) {
          this.setStruttura(selectedNode);
        } */


    // ricarico l'aziendaTipoProcedimento "padre"
    if (!this.aziendaTipoProcedimento) {
      this.aziendaTipoProcedimento = new AziendaTipoProcedimento();
      let dataSourceAziendaTipoProcedimento: DataSource;
      const odataContextDefinitionAziendaTipoProcedimento: OdataContextEntitiesDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
      dataSourceAziendaTipoProcedimento = new DataSource({
        store: odataContextDefinitionAziendaTipoProcedimento.getContext()[new AziendaTipoProcedimento().getName()],
        expand: ["idTitolo"],
        filter: ["id", "=", this.idAziendaTipoProcedimentoFront]
      });


      dataSourceAziendaTipoProcedimento.load().then(res => {
        this.aziendaTipoProcedimento.build(res[0]);
      });
    }

    // devo gestire l'expand. Se metto anche "idAziendaTipoProcedimento.idTitolo" l'aziendaProcedimento padre non ha il titolo si rompe tutto e non si visualizzano i dati
    // l'aziendaProcedimento padre dovrebbe sempre avere il titolo, ma siccome questo non è gestito devo fare qui la gestione
    let expandArrayProcedimento: string[] = ["idAziendaTipoProcedimento","idAziendaTipoProcedimento.idTitolo", "idTitolarePotereSostitutivo", "idAziendaTipoProcedimento.idTipoProcedimento",
      "idStrutturaTitolarePotereSostitutivo", "idStrutturaResponsabileAdozioneAttoFinale", "idResponsabileAdozioneAttoFinale"];

    if (this.aziendaTipoProcedimento.idTitolo) {
      expandArrayProcedimento.push("idAziendaTipoProcedimento.idTitolo");
    }


    // console.log("aziendaTipoProcedimentoOOOOOOOOOOOOOOOOOOOOOOOOOOO", this.aziendaTipoProcedimento);


    this.defaultResponsabile = new UtenteStruttura();
    this.defaultTitolare = new UtenteStruttura();


    if (!this.dataSourceProcedimento) {
      this.dataSourceProcedimento = new DataSource({
        store: this.odataContextDefinitionProcedimento.getContext()[new Procedimento().getName()],
        requireTotalCount: true,
        expand: expandArrayProcedimento,
        filter: [["idAziendaTipoProcedimento.id", "=", this.idAziendaTipoProcedimentoFront], "and", ["idStruttura.id", "=", this.strutturaSelezionata.id]],
        map: (item) => {
          if (item.idAziendaTipoProcedimento.idTitolo) {
            // questo sembra essere il pattern più funzionale: mi creo una variabile (titAndClass) che richiamo poi nell'html
            item.idAziendaTipoProcedimento.idTitolo.titAndClass = "[" + item.idAziendaTipoProcedimento.idTitolo.classificazione + "] " + item.idAziendaTipoProcedimento.idTitolo.nome;
          }
          return item;
        }
      });
    } else {
      this.dataSourceProcedimento.filter([["idAziendaTipoProcedimento.id", "=", this.idAziendaTipoProcedimentoFront], "and", ["idStruttura.id", "=", this.strutturaSelezionata.id]]);
    }
    this.dataSourceProcedimento.load().then(res => {


      if (res.length) {
        this.procedimento = new Procedimento();
        this.procedimento.build(res[0]);
        this.setInitialValues();
        this.formVisible = true;
      } else {
        this.procedimento = null;
        this.initialProcedimento = null;
        this.formVisible = false;
      }



      let idUtente = res[0].idResponsabileAdozioneAttoFinale ? res[0].idResponsabileAdozioneAttoFinale.id : null;
      let idStruttura = res[0].idStrutturaResponsabileAdozioneAttoFinale ? res[0].idStrutturaResponsabileAdozioneAttoFinale.id : null;



      if (!this.dataSourceResponsabile) {
        this.dataSourceResponsabile = this.creaDataSourceUtente(this.odataContextDefinitionResponsabile, idUtente, idStruttura, "responsabile");
      } else if (idUtente && idStruttura) {
        this.dataSourceResponsabile.filter([["idUtente.idAzienda.id", "=", this.idAziendaFront], "and", ["idUtente.id", "=", idUtente], "and", ["idUtente.attivo", "=", true], "and",
        ["idStruttura.id", "=", idStruttura], "and", ["idStruttura.attiva", "=", true]]);
        this.dataSourceResponsabile.load().then(result => {

          this.defaultResponsabile = result[0];
          this.testoTooltipResponsabile = result[0].nomeVisualizzato;
        });
      } else {
        this.defaultResponsabile = undefined;
        this.testoTooltipResponsabile = null;
      }


      idUtente = res[0].idTitolarePotereSostitutivo ? res[0].idTitolarePotereSostitutivo.id : null;
      idStruttura = res[0].idStrutturaTitolarePotereSostitutivo ? res[0].idStrutturaTitolarePotereSostitutivo.id : null;


      if (!this.dataSourceTitolare) {

        this.dataSourceTitolare = this.creaDataSourceUtente(this.odataContextDefinitionTitolare, idUtente, idStruttura, "titolare");
      } else if (idUtente && idStruttura) {
        this.dataSourceTitolare.filter([["idStruttura.idAzienda.id", "=", this.idAziendaFront], "and", ["idUtente.idAzienda.id", "=", this.idAziendaFront], "and", ["idUtente.id", "=", idUtente], "and", ["idUtente.attivo", "=", true],
          "and", ["idStruttura.id", "=", idStruttura], "and", ["idStruttura.attiva", "=", true]]);
        this.dataSourceTitolare.load().then(result => {
          console.log("SUCCESSO_CARICAMENTO_TITOLARE");
          // console.log("RESULT = ", result);
          this.defaultTitolare = result[0];
          this.testoTooltipTitolare = result[0].nomeVisualizzato;
        }).catch(err => console.log("ERRORE_CARICAMENTO_TITOLARE", err));
      } else {
        this.defaultTitolare = undefined;
        this.testoTooltipResponsabile = null;
      }
    });
  }


  setInitialValues() {
    this.initialProcedimento = Entity.cloneObject(this.procedimento);
  }

  public bottoneModificaProcedimento(validationParams: any) {
    this.possoAgireForm = true;
  }


  public bottoneSalvaProcedimento(validationParams: any) {




    // questo lo devo spostare nel validata
    if (this.procedimento.dataFine && (this.procedimento.dataFine < this.procedimento.dataInizio)) {
      notify({ message: "Correggere l'intervallo di validità", type: "error", displayTime: 1200 });
      return;
    }

    let differenze: string[] = Entity.compareObjs(this.descrizioneDataFields, this.initialProcedimento, this.procedimento);
    let differenzeStr: string = "";
    if (differenze.length > 0) {
      differenze.forEach(element => differenzeStr += "<li><b>" + element + "</b></li>");
    }

    this.possoAgireForm = false;

    // se non ho differenze non vado oltre
    if (differenzeStr === "") {
      return;
    }

    confirm("Hai modificato i seguenti campi: <br/>" + differenzeStr + "<br/> Sei sicuro di voler procedere?", "Conferma").then(dialogResult => {

      if (dialogResult) {
        // ho confermato, procedo
        this.dataSourceProcedimento.store().update(this.procedimento.id, this.procedimento)
          .then(res => {
            console.log("OK_UPDATE", res);
            this.caricaDettaglioProcedimento();
            if (this.strutturaSelezionata["hasChildren"]) {
              confirm("Vuoi Estendere le modifiche alle strutture figlie già associate a questo tipo di procedimento?", "Conferma").then(dialogResult2 => {
                if (dialogResult2) {
                  this.http.post(CUSTOM_RESOURCES_BASE_URL + "espandiProcedimenti", this.procedimento.id).subscribe(
                    res2 => {
                      console.log("risultato POST OK", res);
                      this.treeView.caricaDati();
                      notify({ message: "Salvataggio effettuato con successo", type: "success", displayTime: 1200 });
                    },
                    err => {
                      console.log("risultato POST Error", err);
                      notify({ message: "Errore nel salvataggio", type: "error", displayTime: 1200 });
                    }
                  );
                } else {
                  notify({ message: "Salvataggio effettuato con successo", type: "success", displayTime: 1200 });
                }
              });
            } else {
              notify({ message: "Salvataggio effettuato con successo", type: "success", displayTime: 1200 });
            }
          })
          .catch(err => {
            console.log("ERROR_UPDATE", err);
            notify({ message: "Errore nel salvataggio", type: "error", displayTime: 1200 });
          });
      }
    });
  }




  public bottoneAnnulla() {
    let differenze: string[] = Entity.compareObjs(this.descrizioneDataFields, this.initialProcedimento, this.procedimento);
    console.log("DIFFERENZE", differenze);
    // c'è qualche differenza, ricaricare i dati tramite chiamata http per tornare alla situazione di partenza
    // potrebbe bastare che mi riassegni il valore iniziale del procedimento ma non funziona coi dati delle lookup
    if (differenze.length !== 0) {
      this.caricaDettaglioProcedimento();
    }
    this.possoAgireForm = false;
  }



  setStruttura(struttura: any): void {
    this.strutturaSelezionata.nome = struttura.nome;
    this.strutturaSelezionata.id = struttura.id;
    this.strutturaSelezionata["hasChildren"] = struttura.hasChildren;
  }

  selezionaStruttura(selectedNode: any) {

    this.setStruttura(selectedNode);
    this.caricaDettaglioProcedimento();


    // console.log("click su struttura selezionata");

    /*     if (this.initialProcedimento && this.procedimento) {
          let differenze: string[] = Entity.compareObjs(this.descrizioneDataFields, this.initialProcedimento, this.procedimento);
          if (differenze.length !== 0) {
            // il caricamento del dettaglio Procedimento lo fa dentro alla seguente funzione
            // qui devo arrivarci con la struttura selezionata precedente
            this.bottoneSalvaProcedimento(selectedNode);
          }
          else {        
            this.possoAgireForm = false;
            this.caricaDettaglioProcedimento(selectedNode);
          }
        } else {
          // al primo nodo che clicco entro qua e devo comunque caricarmi i dati 
          this.caricaDettaglioProcedimento(selectedNode);
        } */
  }

  /* Setto qui i dati che verranno passati al componente dell'albero e alla popup */
  ngOnInit() {
    this.aziendaTipiProcedimentoData = {
      idAzienda: this.idAziendaFront,
      idAziendaTipoProcedimento: this.idAziendaTipoProcedimentoFront,
      headerTipoProcedimento: this.headerTipoProcedimento
    };
    this.headerStruttura = "Seleziona una struttura...";
  }

  showPopup() {
    this.popupVisible = true;
  }

  // QUESTO EVENTO VIENE EMESSO DALLA POPUP E INDICA ALLA PAGINA SOTTOSTANTE CHE DEVE RICARICARE L'ALBERO PER FAR VEDERE LE MODIFICHE EFFETTUATE
  // qui al posto di fare questa load, vado a ciclare sugli elementi dell'albero in modo da modificare il check direttamente
  // sui nodi dell'albero. Non posso fare il .load() sul datasource perchè poi ogni volta mi richiude l'albero
  //  console.log(this.treeView.datasource);
  refreshTreeView(nodesInvolved) {

    if (nodesInvolved !== new Object() && nodesInvolved !== {}) {
      let keys = Object.keys(nodesInvolved);
      console.log(nodesInvolved);

      if (this.treeView.treeViewChild.items != null) {
        const nodes = this.treeView.treeViewChild.items;

        for (let key of keys) {

          console.log("Operation", nodesInvolved[key]);
          const node = nodes.find(item =>
            item.id === parseInt(key)
          );

          if (nodesInvolved[key] === NodeOperations.INSERT) {
            this.treeView.treeViewChild.instance.selectItem(node.id);
          }
          else {
            this.treeView.treeViewChild.instance.unselectItem(node.id);
          }
        }
      }
    }

    this.popupVisible = false;
  }

  screen(width) {
    return (width <= 1200) ? "sm" : "md";
  }

  creaDataSourceUtente(context: OdataContextDefinition, idUtente: number, idStruttura: number, chiamante: string): DataSource {
    const customLoadingFilterParams: CustomLoadingFilterParams = new CustomLoadingFilterParams("idUtente.idPersona.descrizione");
    customLoadingFilterParams.addFilter(["tolower(${target})", "contains", "${value.tolower}"]);
    const dataSource = new DataSource({
      store: context.getContext()[new UtenteStruttura().getName()].on("loading", (loadOptions) => {
        loadOptions.userData["customLoadingFilterParams"] = customLoadingFilterParams;
        this.odataContextDefinition.customLoading(loadOptions);
      }),
      expand: [
        "idUtente", "idStruttura", "idAfferenzaStruttura", "idUtente.idPersona", "idUtente.idAzienda"
      ],
      filter: [["idStruttura.idAzienda.id", "=", this.idAziendaFront], "and", ["idUtente.idAzienda.id", "=", this.idAziendaFront], "and", ["idUtente.id", "=", idUtente], "and", ["idUtente.attivo", "=", true], "and",
      ["idStruttura.id", "=", idStruttura], "and", ["idStruttura.attiva", "=", true]],
      map: (item) => {
        if (item) {
          if (item.idStruttura && item.idAfferenzaStruttura) {
            item.nomeVisualizzato = item.idUtente.idPersona.descrizione + " (" + item.idStruttura.nome + " - " +
              item.idAfferenzaStruttura.descrizione + ")";
          }
          return item;
        }
      },
      sort: ["idUtente.idPersona.descrizione"],
      searchExpr: function (dataItem) {
        return dataItem.idUtente.idPersona.descrizione;
      }
    });
    dataSource.load().then(res => {
      if (chiamante === "responsabile") {
        this.defaultResponsabile = res[0];
        this.testoTooltipResponsabile = res[0].nomeVisualizzato;
      } else {
        this.defaultTitolare = res[0];
        this.testoTooltipTitolare = res[0].nomeVisualizzato;
      }
    });
    return dataSource;
  }

  setResponsabilePlusStruttura(event: any) {
    // console.log("EVENT SETRESP = ", event);
    this.procedimento.idResponsabileAdozioneAttoFinale = event.itemData.idUtente;
    this.procedimento.idStrutturaResponsabileAdozioneAttoFinale = event.itemData.idStruttura;
    this.testoTooltipResponsabile = event.itemData.nomeVisualizzato;
    // console.log("PROCEDIMENTO RESP = ", event);
  }

  setTitolarePlusStruttura(event: any) {
    // console.log("EVENT SETTITO = ", event);
    this.procedimento.idTitolarePotereSostitutivo = event.itemData.idUtente;
    this.procedimento.idStrutturaTitolarePotereSostitutivo = event.itemData.idStruttura;
    this.testoTooltipTitolare = event.itemData.nomeVisualizzato;
    // console.log("PROCEDIMENTO TITO = ", this.procedimento);
  }

  reloadResponsabile() {
    this.dataSourceResponsabile.filter([["idStruttura.idAzienda.id", "=", this.idAziendaFront], "and", ["idStruttura.attiva", "=", true], "and", ["idUtente.idAzienda.id", "=", this.idAziendaFront], "and", ["idUtente.attivo", "=", true]]);
    this.dataSourceResponsabile.load();
  }

  reloadTitolare() {
    this.dataSourceTitolare.filter([["idStruttura.idAzienda.id", "=", this.idAziendaFront], "and", ["idStruttura.attiva", "=", true], "and", ["idUtente.idAzienda.id", "=", this.idAziendaFront], "and", ["idUtente.attivo", "=", true]]);
    this.dataSourceTitolare.load();
  }

  goBack() {
    this._location.back();
  }



}
