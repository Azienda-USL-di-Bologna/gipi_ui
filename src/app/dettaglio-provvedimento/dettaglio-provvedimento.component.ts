import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DefinizioneTipiProcedimentoService } from '../definizione-tipi-procedimento/definizione-tipi-procedimento.service';
import { TipoProcedimento } from '../classi/tipo-procedimento';
import { SharedData, SharedObjectKeys } from '../classi/context/shared-data';
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
                    this.procedimento.aziendeAssociate[a.idAzienda.nome] = a.idAzienda;
                })
            });
    }

    buttonClicked() {
      // this.sharedData.getSharedObject().pop
      //   this.sharedData.getSharedObject().push(SharedObjectKeys.CURRENT_DOCUMENT, this.procedimento);
        this.router.navigate(['/aziende-tipi-procedimento']);
    }

}
