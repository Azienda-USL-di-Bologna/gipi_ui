import { Component, OnInit } from '@angular/core';
import { DefinizioneTipiProcedimentoService } from '../definizione-tipi-procedimento/definizione-tipi-procedimento.service';
import { TipoProcedimento } from '../classi/tipo-procedimento';
import 'rxjs/add/operator/toPromise';


@Component({
  selector: 'app-dettaglio-provvedimento',
  templateUrl: './dettaglio-provvedimento.component.html',
  styleUrls: ['./dettaglio-provvedimento.component.css']
})
export class DettaglioProvvedimentoComponent implements OnInit {

  procedimento: TipoProcedimento;
  aziende: string[];

  constructor(private service: DefinizioneTipiProcedimentoService ) {
    // Il procedimento viene passato dall'interfaccia principale. Qua recupero solo le associazioni con le aziende.

    // this.procedimento = {
    //   idTipoProcedimento: service.selectedRow.idTipoProcedimento,
    //   nomeTipoProcedimento: service.selectedRow.nomeTipoProcedimento,
    //   descrizioneTipoProcedimentoDefault: service.selectedRow.descrizioneTipoProcedimentoDefault,
    //   modoApertura: service.selectedRow.modoApertura,
    //   normaRiferimento: service.selectedRow.normaRiferimento,
    //   dataInizioValidita: service.selectedRow.dataInizioValidita,
    //   dataFineValidita: service.selectedRow.dataFineValidita,
    //   durataMassimaSospensione: service.selectedRow.durataMassimaSospensione,
    //   aziendeAssociate: new Array()
    // }
    this.procedimento = service.selectedRow;
    this.getAziendeAssociate();
  }

  ngOnInit() {
  }

  // associaDisassocia(azienda: string){
  //   if(this.procedimento.aziendeAssociate[azienda]){
  //     // TODO: Chiamata al server per la disassociazione
  //     this.procedimento.aziendeAssociate[azienda] = undefined;
  //     // this.procedimento.aziendeAssociate[azienda].associata = !this.procedimento.aziendeAssociate[azienda].associata;
  //   }else{
  //     // TODO: Chiamata al server per la l'associazione
  //     this.procedimento.aziendeAssociate[azienda] = {azienda};
  //   }
  // }

  getAziendeAssociate() {
    this.service.getAziendeAssociateRequest(this.procedimento.idTipoProcedimento.toString())
                            .toPromise()
                            .then(response => {
                              this.aziende = ['AUSLBO', 'AOSPBO', 'IOR', 'AUSLIMOLA', 'AOSPFE', 'AUSLFE', 'AUSLPARMA'];
                              this.procedimento.aziendeAssociate = new Array();
                              // console.log('RESPONSE: ', response);
                              response.forEach(a => {
                                this.procedimento.aziendeAssociate[a.idAzienda.nome] = a.idAzienda;
                              })
                          });
  }
}
