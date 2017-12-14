import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { DefinizioneTipiProcedimentoService } from "../definizione-tipi-procedimento/definizione-tipi-procedimento.service";
import { TipoProcedimento } from "../classi/server-objects/entities/tipo-procedimento";
// import {Azienda, AZIENDE} from '../classi/aziende';
import "rxjs/add/operator/toPromise";
import DataSource from "devextreme/data/data_source";
import {OdataContextDefinition} from "@bds/nt-angular-context/odata-context-definition";
import {Azienda} from "../classi/server-objects/entities/azienda";
import {Entities} from "../../environments/app.constants";
import {OdataContextFactory} from "@bds/nt-angular-context/odata-context-factory";
import {GlobalContextService} from "@bds/nt-angular-context/global-context.service";

@Component({
    selector: "app-dettaglio-procedimento",
    templateUrl: "./dettaglio-procedimento.component.html",
    styleUrls: ["./dettaglio-procedimento.component.css"]
})
export class DettaglioProcedimentoComponent implements OnInit {
    private aziendeDatasource: DataSource;
    private odataContextDefinition: OdataContextDefinition;
    procedimento: TipoProcedimento;
    // aziende: Azienda[];
    aziende: Array<Azienda>;

    constructor(private service: DefinizioneTipiProcedimentoService,
                private router: Router,
                private odataContexFactory: OdataContextFactory,
                private globalContextService: GlobalContextService) {
        this.procedimento = service.selectedRow;
        this.odataContextDefinition = odataContexFactory.buildOdataContextEntitiesDefinition();
        this.aziendeDatasource = new DataSource({
            store: this.odataContextDefinition.getContext()[Entities.Azienda.name],
            expand: ["aziendaTipoProcedimentoList"]
        });
        this.aziendeDatasource.load().then(res => {this.aziende = res; this.getAziendeAssociate(); });
        // this.getAziendeAssociate();
    }

    ngOnInit() {
    }
    getAziendeAssociate() {
        this.procedimento.aziendeAssociate = new Array();
        for (const azienda of this.aziende) {
            if (azienda.aziendaTipoProcedimentoList.find(item => item.FK_id_tipo_procedimento === this.procedimento.idTipoProcedimento)) {
                this.procedimento.aziendeAssociate[azienda.id] = azienda;
            }
        }
    }

    // getAziendeAssociate() {
    //     this.service.getAziendeAssociateRequest(this.procedimento.idAziendaTipoProcedimento.toString())
    //         .toPromise()
    //         .then(response => {
    //           // this.aziende = AZIENDE;
    //           this.procedimento.aziendeAssociate = new Array();
    //             response.forEach(a => {
    //               for (let azienda of this.aziende) {
    //                   if(azienda.codice === a.idAzienda.codice){
    //                     this.procedimento.aziendeAssociate[a.idAzienda.codice] = azienda;
    //                     break;
    //                   }
    //               }
    //             })
    //         });
    // }

    buttonClicked(azienda) {
        // MI COSTRUISCO UN OGGETTO "CARONTE" DA METTERE DENTRO L'OGGETTO SharedData  CHE IN QUESTO CASO PASSO ALLA VIDEATA aziende-tipi-procedimento
        // let obj = {
        //     "DettaglioProvvedimentoComponent":
        //     {
        //         "tipoProcedimento": this.procedimento,
        //         "azienda": azienda,
        //         "aziendaAssociata": this.procedimento.aziendeAssociate[azienda.id] ? true : false,
        //     }
        // };
        let obj = {
                    "tipoProcedimento": this.procedimento,
                    "azienda": azienda,
                    "aziendaAssociata": this.procedimento.aziendeAssociate[azienda.id] ? true : false,
                };
        this.globalContextService.setInnerSharedObject("DettaglioProcedimentoComponent", obj);
        // this.sharedData.setSharedObject(obj);
        this.router.navigate(["/aziende-tipi-procedimento"]);
    }

}
