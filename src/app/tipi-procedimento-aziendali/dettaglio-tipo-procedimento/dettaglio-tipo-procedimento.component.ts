import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import {AziendaTipoProcedimento, Titolo, bAzienda, bUtente} from "@bds/nt-entities";
import DataSource from "devextreme/data/data_source";
import { CustomLoadingFilterParams, OdataContextFactory, GlobalContextService, OdataContextDefinition } from "@bds/nt-context";
import { LoggedUser } from "@bds/nt-login";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import notify from "devextreme/ui/notify";


@Component({
  selector: "dettaglio-tipo-procedimento",
  templateUrl: "./dettaglio-tipo-procedimento.component.html",
  styleUrls: ["./dettaglio-tipo-procedimento.component.scss"]
})
export class DettaglioTipoProcedimentoComponent implements OnInit {

  private odataContextDefinition: OdataContextDefinition;
  private loaded: boolean = false;

  public idProcedimentoInput: number;
  public proc: AziendaTipoProcedimento = new AziendaTipoProcedimento();
  public dataSourceTitoli: DataSource;
  public dataSourceAziendaTipoProcedimento: DataSource;
  public loggedUser: LoggedUser;


  // tslint:disable-next-line:no-input-rename
  @Input()
  set procedimento(procedimento: number) {
    console.log("dettaglio-tipo-procedimento Sono nell'@Input");
    console.log("INPUT PROCEDIMENTO", procedimento);
    this.idProcedimentoInput = procedimento;
    this.proc = new AziendaTipoProcedimento(); 
    /* if(!this.loaded){
      console.log("dettaglio-tipo-procedimento Input --> !loaded...");
    } */
    this.caricaDataSource();
  }

  @Output() messageEvent: EventEmitter<any>= new EventEmitter();

  constructor(private odataContextFactory: OdataContextFactory, private globalContextService: GlobalContextService, private http: HttpClient) {
    console.log("dettaglio-tipo-procedimento Constructor");
    this.odataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
    this.loggedUser = this.globalContextService.getInnerSharedObject("loggedUser")
    const customLoadingFilterParams: CustomLoadingFilterParams = new CustomLoadingFilterParams("nome");
    customLoadingFilterParams.addFilter(["tolower(${target})", "contains", "${value.tolower}"]);
  
    this.dataSourceTitoli = new DataSource({
      store: this.odataContextDefinition.getContext()[new Titolo().getName()].on("loading", (loadOptions) => {
        loadOptions.userData["customLoadingFilterParams"] = customLoadingFilterParams;
        this.odataContextDefinition.customLoading(loadOptions);
      }),
      filter: ["idAzienda", "=", this.loggedUser.getField(bUtente.aziendaLogin)[bAzienda.id]],
      map: (item) => {
        if (item) {
          item.titAndClass = "[" + item.classificazione + "] " + item.nome;
        }
        return item;
      }
    });

  }

  ngOnInit() {
    console.log("dettaglio-tipo-procedimento ngOnInit");
    if (!this.loaded) {
      console.log("dettaglio-tipo-procedimento ngOnInit --> !loaded...");
      this.caricaDataSource();
    }
  }

  ngOnChanges() {
    console.log("dettaglio-tipo-procedimento ngOnChanges");
    /* if(!this.loaded){
      console.log("dettaglio-tipo-procedimento ngOnChanges --> !loaded...");
      this.caricaDataSource();
    } */
  }

  ngOnClose() {
    console.log("dettaglio-tipo-procedimento ngOnClose");
    // this.proc = new AziendaTipoProcedimento();
    this.loaded = false;
    this.messageEvent.emit({visible: false, reloadPadre: false});
  }

  public close(toReloadPadre: boolean) {
    console.log("dettaglio-tipo-procedimento CLOSE");
    // this.proc = new AziendaTipoProcedimento();
    this.loaded = false;
    this.messageEvent.emit({visible: false, reloadPadre: (toReloadPadre ? true : false)});
  }

  public save() {
    console.log("dettaglio-tipo-procedimento CARICADATASOURCE");
    this.dataSourceAziendaTipoProcedimento.store().update(this.proc.id, this.proc).then( 
      res => {
        notify({
          message: "Salvataggio effettuato con successo!",
          type: "success",
          displayTime: 2100,
          position: {
            my: "center", at: "center", of: window
          },
          width: "max-content"
        });
        this.close(true);
      },
      err => {
        console.log("--> ERR", err);
        notify({
          message: "Problemi nel salvataggio del detteglio. Se il problema persiste contattare BabelCare",
          type: "error",
          displayTime: 2100,
          position: {
            my: "center", at: "center", of: window
          },
          width: "max-content"
        });
      }
    );
  }

  public caricaDataSource() {
    this.loaded = true;
    console.log("dettaglio-tipo-procedimento CARICADATASOURCE");   
    // this.odataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
    this.dataSourceAziendaTipoProcedimento = new DataSource({
      store: this.odataContextDefinition.getContext()[new AziendaTipoProcedimento().getName()].on("loading", console.log("STO CARICNDO I DATIIIIII!!!!!!!!!!!")),
      expand: ["idTitolo", "idTipoProcedimento", "idAzienda"],
      filter: ["id", "=", this.idProcedimentoInput],
      map: (item) => {
        console.log("MI MAPPO GLI ITEM");
        if (item.idTitolo) {
          item.titAndClass = "[" + item.idTitolo.classificazione + "] " +  item.idTitolo.nome;
          console.log(item.titAndClass);
        }
        return item;
      }

    });
    this.dataSourceAziendaTipoProcedimento.load().then((res) => { 
      this.proc.build(res[0]); 
      console.log("QUESTO E' IL BUILD", this.proc);  
    });
    console.log("Loggo se mi ha caricato", this.dataSourceAziendaTipoProcedimento);
  }
}

