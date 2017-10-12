import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DefinizioneTipiProcedimentoService } from '../definizione-tipi-procedimento/definizione-tipi-procedimento.service';
import { TipoProcedimento } from '../classi/tipo-procedimento';
import { SharedData } from '../classi/context/shared-data';
import { Azienda, AZIENDE } from '../classi/aziende';
import 'rxjs/add/operator/toPromise';

@Component({
    selector: 'app-dettaglio-provvedimento',
    templateUrl: './dettaglio-provvedimento.component.html',
    styleUrls: ['./dettaglio-provvedimento.component.css']
})
export class DettaglioProvvedimentoComponent implements OnInit {

    procedimento: TipoProcedimento;
    aziende: Azienda[];
    router: Router;

    constructor(private service: DefinizioneTipiProcedimentoService, router: Router, private sharedData: SharedData) {
        this.router = router;
        this.procedimento = service.selectedRow;
        this.getAziendeAssociate();
    }

    ngOnInit() {
    }

    getAziendeAssociate() {
        this.service.getAziendeAssociateRequest(this.procedimento.idTipoProcedimento.toString())
            .toPromise()
            .then(response => {
              this.aziende = AZIENDE;
              this.procedimento.aziendeAssociate = new Array();
                response.forEach(a => {
                  for (let azienda of this.aziende) {
                      if(azienda.codice === a.idAzienda.nome){
                        this.procedimento.aziendeAssociate[a.idAzienda.nome] = azienda;
                        break;
                      }
                  }
                })
            });
    }

    buttonClicked(azienda) {
        //MI COSTRUISCO UN OGGETTO "CARONTE" DA METTERE DENTRO L'OGGETTO SharedData  CHE IN QUESTO CASO PASSO ALLA VIDEATA aziende-tipi-procedimento
        let obj = new Object();
        obj["procedimento"] = this.procedimento;
        obj["azienda"] = azienda;
        this.sharedData.setSharedObject(obj);
        this.router.navigate(['/aziende-tipi-procedimento']);
    }

}
