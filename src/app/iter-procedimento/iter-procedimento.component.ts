import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import DataSource from "devextreme/data/data_source";
import { OdataContextDefinition } from "@bds/nt-angular-context/odata-context-definition";
import { CustomLoadingFilterParams } from "@bds/nt-angular-context/custom-loading-filter-params";
import { OdataContextFactory } from "@bds/nt-angular-context/odata-context-factory";
import { Entities, CUSTOM_RESOURCES_BASE_URL } from "environments/app.constants";
import { SequenzaDelleFasiComponent } from "./sequenza-delle-fasi/sequenza-delle-fasi.component";
import { Iter } from "../classi/server-objects/entities/iter";
import { Utente } from "../classi/server-objects/entities/utente";
import { Fase } from "../classi/server-objects/entities/fase";
import { FaseIter } from "../classi/server-objects/entities/fase-iter";
import { ProcedimentoCache } from "../classi/server-objects/entities/procedimento-cache";
import { PassaggioDiFaseComponent } from "./passaggio-di-fase/passaggio-di-fase.component";
import { HttpClient } from "@angular/common/http";
import notify from "devextreme/ui/notify";
import { ActivatedRoute, Params } from "@angular/router";


@Component({
  selector: "app-iter-procedimento",
  templateUrl: "./iter-procedimento.component.html",
  styleUrls: ["./iter-procedimento.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class IterProcedimentoComponent implements OnInit {

  // @ViewChild(PassaggioDiFaseComponent) child;

  public iter: Iter = new Iter();
  public idIterArray: Object;
  public procedimentoCache = new ProcedimentoCache;
  public dataSourceIter: DataSource;
  public durataPrevista: number;
  public idIter: number = 6;

  public popupVisible: boolean = false;
  public passaggioDiFaseVisible: boolean = false;
  public sospensioneIterVisible: boolean = false;

  // Dati che verranno ricevuti dall'interfaccia chiamante
  public infoGeneriche: any = {
    azienda: "AOSP-BO",
    struttura: "UO DaTer",
    tipoProcedimento: "Tipologia A",
    numeroIter: 6
  };
  public popupData: any = {
    visible: false,
    title: "titolo",
    field: "nome campo",
    fieldValue: "valore"
  };
  public perFigliParteDestra: Object;

  public perFiglioPassaggioFase: Object;

  public paramsPerSospensione;

  constructor(private odataContextFactory: OdataContextFactory, private http: HttpClient, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe((queryParams: Params) => {
      const idIter: string = queryParams["idIter"];
      if (idIter) {
        this.idIter = +idIter;
      }
      console.log(idIter);
    });


    const oataContextDefinitionTitolo: OdataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
    const customLoadingFilterParams: CustomLoadingFilterParams = new CustomLoadingFilterParams("nomeTitolo");
    customLoadingFilterParams.addFilter(["tolower(${target})", "contains", "${value.tolower}"]);

    this.dataSourceIter = new DataSource({
      store: oataContextDefinitionTitolo.getContext()[Entities.Iter.name],
      expand: ["idFaseCorrente", "idIterPrecedente", "idResponsabileProcedimento", "idResponsabileAdozioneProcedimentoFinale", "procedimentoCache", "procedimentoCache.idTitolarePotereSostitutivo"],
      filter: [["id", "=", this.idIter]]
    });
    this.buildIter();

    this.paramsPerSospensione = this.iter;

    this.perFigliParteDestra = {
      idIter: this.idIter,
      ricarica: false  // ricarica è un flag, se modificato ricarica (ngOnChange). Non importa il valore
    };


  }

  ngAfterViewInit() {
    // this.passaggioDiFaseVisible = this.child.visibile;
  }


  ngOnInit() {

  }

  buildIter() {
    this.dataSourceIter.load().then(res => {
      this.iter.build(res[0], Iter);
      this.iter.dataChiusuraPrevista = new Date(this.iter.dataAvvio.getTime());
      this.iter.dataChiusuraPrevista.setDate(this.iter.dataChiusuraPrevista.getDate() + this.iter.procedimentoCache.durataMassimaProcedimento);



    });
  }

  updateNoteControInteressati() {
    this.popupData.title = "Note controinteressati";
    this.popupData.field = "noteControInteressati";
    this.popupData.fieldValue = this.iter.noteControinteressati;
    this.popupData.visible = true;
  }

  updateEsitoMotivazione() {
    this.popupData.title = "Esito motivazione";
    this.popupData.field = "esitoMotivazione";
    this.popupData.fieldValue = this.iter.esitoMotivazione;
    this.popupData.visible = true;
  }

  /*  onShowing(event:Event){
      debugger;
  
  }*/

  public passaggioDiFase() {
    /*this.idIterArray = [6];
    this.popupData.title = 'Esito motivazione';
    this.popupData.field = 'esitoMotivazione';
    this.popupData.fieldValue = this.iter.esitoMotivazione;
    this.popupData.visible = true;*/

    const req = this.http.get(CUSTOM_RESOURCES_BASE_URL + "iter/getProcessStatus" + "?idIter=" + this.idIter)
      .subscribe(
      res => {
        // debugger;
        // console.log(res)
        let current = JSON.parse(res["currentFase"]);
        let next = JSON.parse(res["nextFase"]);

        this.perFiglioPassaggioFase = {
          idIter: this.idIter,
          currentFaseName: current.nomeFase,
          nextFaseName: next.nomeFase,
          isNextFaseDiChiusura: next.faseDiChiusura
        };

        this.popupData.title = "Passaggio Di Fase";
        this.passaggioDiFaseVisible = true;
      },
      err => {
        notify("Non esiste la fase successiva", "error", 1000);
        // debugger;
      });
  }

  public sospensioneIter() {
    this.popupData.title = "Gestione Sospensione";
    this.sospensioneIterVisible = true;
  }

  receiveMessage($event) {
    // console.log("loggo il messaggio....");
    // console.log($event);
    this.passaggioDiFaseVisible = $event["visible"];
    if ($event["proceduto"]) {
      let perFigliNew: Object = { idIter: this.idIter, cambiato: !this.perFigliParteDestra["ricarica"] };
      this.perFigliParteDestra = perFigliNew;
      this.buildIter();
      notify("Proceduto con successo", "success", 1000);
    }
  }

  receiveMessageFromSospensione($event) {
    // console.log("loggo il messaggio....");
    // console.log($event);
    this.sospensioneIterVisible = $event["visible"];

   
  }

  
  nomeBottoneSospensione() {
    if (this.iter.stato === "sospeso") 
      return "Termina Sospensione";
    else
      return "Sospendi";
  }

}
