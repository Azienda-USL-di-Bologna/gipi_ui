import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import {AziendaTipoProcedimento, Titolo, bAzienda, bUtente} from "@bds/nt-entities";
import DataSource from "devextreme/data/data_source";
import { CustomLoadingFilterParams, OdataContextFactory, GlobalContextService, OdataContextDefinition } from "@bds/nt-context";
import { LoggedUser } from "@bds/nt-login";
import { HttpClient } from "@angular/common/http";
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
  public pattern: any =  "^[1-9][0-9]*$";

  @Input()
  set procedimento(procedimento: number) {
    this.idProcedimentoInput = procedimento;
    this.proc = new AziendaTipoProcedimento(); 
    this.caricaDataSource(false);
  }

  @Output() messageEvent: EventEmitter<any>= new EventEmitter();

  constructor(private odataContextFactory: OdataContextFactory, private globalContextService: GlobalContextService, private http: HttpClient) {
    console.log("dettaglio-tipo-procedimento CONSTRUCTOR");
    console.log("file: app/tipi-procedimento-aziendali/dettaglio-tipo-procedimento/dettaglio-tipo-procedimento.components.ts");
    this.odataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
    this.loggedUser = this.globalContextService.getInnerSharedObject("loggedUser");
    const customLoadingFilterParams: CustomLoadingFilterParams = new CustomLoadingFilterParams();
    customLoadingFilterParams.addFilter("nome", ["tolower(${target})", "contains", "${value.tolower}"]);
    customLoadingFilterParams.addFilter("classificazione", ["tolower(${target})", "contains", "${value.tolower}"]);

    this.dataSourceTitoli = new DataSource({
      store: this.odataContextDefinition.getContext()[new Titolo().getName()]
      .on("loading", (loadOptions) => {
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
      this.caricaDataSource(false);
    }
  }

  ngOnClose() {
    this.loaded = false;
    this.messageEvent.emit({visible: false, reloadPadre: false});
  }

  public close(toReloadPadre: boolean) {
    this.loaded = false;
    this.messageEvent.emit({visible: false, reloadPadre: (toReloadPadre ? true : false)});
  }

  validate(params) {
      let result = params.validationGroup.validate();
      if (result.isValid) {
          this.save();
      }
  }

  public save() {
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
        this.caricaDataSource(true);
        
      },
      err => {
        console.log("--> ERR", err);
        notify({
          message: "Problemi nel salvataggio del dettaglio. Se il problema persiste contattare BabelCare.",
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

  public caricaDataSource(chiudi: boolean) {
    this.loaded = true;
    this.dataSourceAziendaTipoProcedimento = new DataSource({
      store: this.odataContextDefinition.getContext()[new AziendaTipoProcedimento().getName()],
      expand: ["idTitolo", "idTipoProcedimento", "idAzienda"],
      filter: ["id", "=", this.idProcedimentoInput],
      map: (item) => {
        if (item.idTitolo) {
          item.titAndClass = "[" + item.idTitolo.classificazione + "] " +  item.idTitolo.nome;
        }
        return item;
      }
    });
    this.dataSourceAziendaTipoProcedimento.load().then((res) => { 
      this.proc.build(res[0]); 
      if (chiudi)
        this.close(true);
    });
  }
}
