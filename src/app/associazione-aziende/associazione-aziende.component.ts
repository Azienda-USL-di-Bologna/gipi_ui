import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs/Subscription";
import { Router } from "@angular/router";
import { DefinizioneTipiProcedimentoService } from "../definizione-tipi-procedimento/definizione-tipi-procedimento.service";
import { TipoProcedimento, AziendaTipoProcedimento, Azienda, bUtente, bAzienda} from "@bds/nt-entities";
import "rxjs/add/operator/toPromise";
import DataSource from "devextreme/data/data_source";
import { OdataContextDefinition } from "@bds/nt-context";
import { OdataContextFactory } from "@bds/nt-context";
import { GlobalContextService } from "@bds/nt-context";
import { CustomReuseStrategy } from "@bds/nt-context";
import { ButtonAppearance } from "@bds/nt-context";
import { LoggedUser } from "@bds/nt-login";

@Component({
    selector: "app-associazione-aziende",
    templateUrl: "./associazione-aziende.component.html",
    styleUrls: ["./associazione-aziende.component.css"]
})
export class AssociazioneAziendeComponent implements OnInit, OnDestroy {

    private odataContextDefinitionAzienda: OdataContextDefinition;
    private aziendeDatasource: DataSource;

    private odataContextEntitiesAziendaTipoProcedimento: OdataContextDefinition;
    private datasourceAziendaTipoProcedimento: DataSource;

    // aziende: Azienda[];
    public procedimento: TipoProcedimento;
    public aziende: Array<Azienda>;
    public backBtn: ButtonAppearance;
    public idAziendaUtente: number;


/*    public SUPERADM: number = Ruoli.SUPERADM;
    public ADM: number = Ruoli.ADM;*/

    // public loggedUser$: Observable<LoggedUser>
    public loggedUser: LoggedUser;

    public subscriptions: Subscription[] = [];

    constructor(private service: DefinizioneTipiProcedimentoService,
        private router: Router,
        private odataContexFactory: OdataContextFactory,
        private globalContextService: GlobalContextService) {

        this.backBtn = new ButtonAppearance("indietro", "back", true, false);

        this.procedimento = service.selectedRow;
        this.odataContextDefinitionAzienda = odataContexFactory.buildOdataContextEntitiesDefinition();
        this.aziendeDatasource = new DataSource({
            store: this.odataContextDefinitionAzienda.getContext()[new Azienda().getName()],
            expand: ["aziendaTipoProcedimentoList", "aziendaTipoProcedimentoList/idTipoProcedimento"]
        });
        this.aziendeDatasource.load().then(res => { this.aziende = res; this.getAziendeAssociate(); });

        this.odataContextEntitiesAziendaTipoProcedimento = odataContexFactory.buildOdataContextEntitiesDefinition();
        this.datasourceAziendaTipoProcedimento = new DataSource({
            store: this.odataContextEntitiesAziendaTipoProcedimento.getContext()[new AziendaTipoProcedimento().getName()]
                .on("modifying", () => { console.log("modified"); })
                .on("modified", () => { console.log("modified"); }),
            // filter: [['idTipoProcedimento.idTipoProcedimento', '=', this.sharedData.getSharedObject().procedimento.idAziendaTipoProcedimento], ['idAzienda.id', '=', this.sharedData.getSharedObject().azienda.id]],
        });
        // this.getAziendeAssociate();
    }

    ngOnInit() {
        // this.loggedUser$ = this.globalContextService.getSubjectInnerSharedObject("loggedUser");
        this.loggedUser = this.globalContextService.getInnerSharedObject("loggedUser");
        this.idAziendaUtente = this.loggedUser.getField(bUtente.aziendaLogin)[bAzienda.id];
/*        this.subscriptions.push(
            this.loggedUser$.subscribe(
                (loggedUser: LoggedUser) => {
                    this.isSUPERADM = loggedUser.hasRole(Ruoli.SUPERADM);
                    this.isADM = loggedUser.hasRole(Ruoli.ADM);
                }
            )
        );*/
    }

    onEditorFocus(e) {
        
    }

    ngOnDestroy() {
        this.subscriptions.forEach(
            (subscrition: Subscription) => {
                subscrition.unsubscribe();
            }
        );
    }

    getAziendeAssociate() {
        this.procedimento["aziendeAssociate"] = new Array();
        for (const azienda of this.aziende) {
            if (azienda.aziendaTipoProcedimentoList.find(item => item.idTipoProcedimento.id === this.procedimento.id)) {
                this.procedimento["aziendeAssociate"][azienda.id] = azienda;
            }
        }
    }

    onBack() {
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

    buttonClicked(azienda: Azienda, operazione: string) {
        // MI COSTRUISCO UN OGGETTO "CARONTE" DA METTERE DENTRO L'OGGETTO SharedData  CHE IN QUESTO CASO PASSO ALLA VIDEATA aziende-tipi-procedimento
        // let obj = {
        //     "DettaglioProvvedimentoComponent":
        //     {
        //         "tipoProcedimento": this.procedimento,
        //         "azienda": azienda,
        //         "aziendaAssociata": this.procedimento.aziendeAssociate[azienda.id] ? true : false,
        //     }
        // };


        switch (operazione) {
            case "gestisciAssociazione":
                let obj = {
                    "tipoProcedimento": this.procedimento,
                    "azienda": azienda,
                    "aziendaAssociata": this.procedimento["aziendeAssociate"][azienda.id] ? true : false,
                };
                this.globalContextService.setInnerSharedObject("AssociazioneAziendeComponent", obj);
                // this.sharedData.setSharedObject(obj);
                this.router.navigate(["/gestione-associazione-aziende"]);
                break;
            case "associa":
                console.log("associa clicked");
                const aziendaTipoProcedimentoToInsert: AziendaTipoProcedimento = new AziendaTipoProcedimento();

                aziendaTipoProcedimentoToInsert.descrizioneTipoProcedimento = this.procedimento.descrizioneDefault;
                aziendaTipoProcedimentoToInsert.durataMassimaProcedimento = this.procedimento.durataMassimaIter;
                aziendaTipoProcedimentoToInsert.durataMassimaSospensione = this.procedimento.durataMassimaSospensione;
                aziendaTipoProcedimentoToInsert.obbligoEsitoConclusivo = false;
                aziendaTipoProcedimentoToInsert.idAzienda = azienda;
                aziendaTipoProcedimentoToInsert.dataInizio = new Date();
                aziendaTipoProcedimentoToInsert.idTipoProcedimento = this.procedimento;
                console.log(aziendaTipoProcedimentoToInsert);
                this.datasourceAziendaTipoProcedimento.store().insert(aziendaTipoProcedimentoToInsert).done(res => {
                    console.log("azienda associata con successo");
                    this.aziendeDatasource.load().then((res) => { this.aziende = res; this.getAziendeAssociate(); });
                });
                break;
            case "disassocia":
                console.log("disassocia clicked");
                let aziendaTipoProcedimentoToRemove: AziendaTipoProcedimento = azienda.aziendaTipoProcedimentoList.find(item => item.idTipoProcedimento.id === this.procedimento.id);
                this.datasourceAziendaTipoProcedimento.store().remove(aziendaTipoProcedimentoToRemove.id).done(res => {
                    console.log("azienda rimossa con successo");
                    this.aziendeDatasource.load().then(res => { this.aziende = res; this.getAziendeAssociate(); });
                });
                break;
        }
    }

}
