import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import {AziendaTipoProcedimento, Titolo, bAzienda, bUtente, TipoProcedimento} from "@bds/nt-entities";
import DataSource from "devextreme/data/data_source";
import { CustomLoadingFilterParams, OdataContextFactory, GlobalContextService, OdataContextDefinition } from "@bds/nt-context";
import { LoggedUser } from "@bds/nt-login";
import { HttpClient } from "@angular/common/http";
import notify from "devextreme/ui/notify";
import { TOAST_WIDTH, TOAST_POSITION } from "environments/app.constants";
import { DxFormComponent } from "devextreme-angular";


@Component({
  selector: "dettaglio-tipo-procedimento",
  templateUrl: "./dettaglio-tipo-procedimento.component.html",
  styleUrls: ["./dettaglio-tipo-procedimento.component.scss"]
})
export class DettaglioTipoProcedimentoComponent implements OnInit {

  private odataContextDefinition: OdataContextDefinition;
  private loaded: boolean = false;
  private dataInizio: Date;
  private dataFine: Date;

  public idProcedimentoInput: number;
  public proc: AziendaTipoProcedimento = new AziendaTipoProcedimento();
  public dataSourceTitoli: DataSource;
  public dataSourceAziendaTipoProcedimento: DataSource;
  public loggedUser: LoggedUser;
  public patternGreaterZero: any = "^[1-9][0-9]*$";
  public patternGreaterEqualZero: any = "^[0-9][0-9]*$";
  public dataInizioTipoProcedimento: Date = new Date();
  public dataFineTipoProcedimento: Date = new Date();
  public messaggioData: string;

  @Input()
  set procedimento(procedimento: number) {
    this.idProcedimentoInput = procedimento;
    this.proc = new AziendaTipoProcedimento(); 
    this.caricaDataSource(false);
  }

  @Output() messageEvent: EventEmitter<any>= new EventEmitter();

  @ViewChild("myForm") public myForm: DxFormComponent;

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
    this.checkDataInizio = this.checkDataInizio.bind(this);
    this.checkDataFine = this.checkDataFine.bind(this);
  }

  private showStatusOperation(message: string, type: string) {
    notify({
      message: message,
        type: type,
        displayTime: 2100,
        position: TOAST_POSITION,
        width: TOAST_WIDTH
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

  validaForm = () => {
    console.log("Valido");
    this.myForm.instance.validate();
  }

  public save() {
    this.dataSourceAziendaTipoProcedimento.store().update(this.proc.id, this.proc).then( 
      res => {
        this.showStatusOperation("Salvataggio effettuato con successo!", "success");
        this.caricaDataSource(true);
      },
      err => {
        console.log("--> ERR", err);
        this.showStatusOperation("Problemi nel salvataggio del dettaglio. Se il problema persiste contattare BabelCare.", "error");
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
      this.dataInizioTipoProcedimento = res[0].idTipoProcedimento.dataInizioValidita;
      this.dataFineTipoProcedimento = res[0].idTipoProcedimento.dataFineValidita;
      if (chiudi)
        this.close(true);
    });
  }

  public checkDataFine(event: any) {
    if ((event.value instanceof Date && event.value >= this.proc.dataInizio) || event.value === null) { // La data di fine validità può essere nulla
      return true;
    } else return false;
  }  

  public checkDataInizio(event: any) {
    if (event.value <= this.proc.dataFine || this.proc.dataFine === null) {
      return true;
    } else return false;
  }
}
