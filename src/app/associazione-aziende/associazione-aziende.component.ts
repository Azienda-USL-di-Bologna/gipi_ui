import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { DefinizioneTipiProcedimentoService } from "../definizione-tipi-procedimento/definizione-tipi-procedimento.service";
import { TipoProcedimento } from "../classi/server-objects/entities/tipo-procedimento";
import "rxjs/add/operator/toPromise";
import DataSource from "devextreme/data/data_source";
import {OdataContextDefinition} from "@bds/nt-angular-context/odata-context-definition";
import {Azienda} from "../classi/server-objects/entities/azienda";
import {Entities} from "../../environments/app.constants";
import {OdataContextFactory} from "@bds/nt-angular-context/odata-context-factory";
import {GlobalContextService} from "@bds/nt-angular-context/global-context.service";
import {CustomReuseStrategy} from "@bds/nt-angular-context/routes/custom-reuse-strategy";
import {ButtonAppearance} from "@bds/nt-angular-context/templates/buttons-bar/buttons-bar.component";

@Component({
    selector: "app-associazione-aziende",
    templateUrl: "./associazione-aziende.component.html",
    styleUrls: ["./associazione-aziende.component.css"]
})
export class AssociazioneAziendeComponent implements OnInit {

    private aziendeDatasource: DataSource;
    private odataContextDefinition: OdataContextDefinition;
    // aziende: Azienda[];
    public procedimento: TipoProcedimento;
    public aziende: Array<Azienda>;
    public backBtn: ButtonAppearance;

    constructor(private service: DefinizioneTipiProcedimentoService,
                private router: Router,
                private odataContexFactory: OdataContextFactory,
                private globalContextService: GlobalContextService) {

        this.backBtn = new ButtonAppearance("indietro", "back", true, false);

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
            if (azienda.aziendaTipoProcedimentoList.find(item => item.FK_id_tipo_procedimento === this.procedimento.id)) {
                this.procedimento.aziendeAssociate[azienda.id] = azienda;
            }
        }
    }

    onBack(){
        CustomReuseStrategy.componentsReuseList.push("*");
        this.router.navigate(["/definizione-tipi-procedimento"]);
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
        this.globalContextService.setInnerSharedObject("AssociazioneAziendeComponent", obj);
        // this.sharedData.setSharedObject(obj);
        this.router.navigate(["/gestione-associazione-azienda"]);
    }

}