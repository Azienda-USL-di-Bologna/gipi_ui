import { Component, OnInit } from '@angular/core';
import { DefinizioneTipiProcedimentoService } from '../definizione-tipi-procedimento/definizione-tipi-procedimento.service';
import 'rxjs/add/operator/toPromise';


@Component({
  selector: 'app-dettaglio-provvedimento',
  templateUrl: './dettaglio-provvedimento.component.html',
  styleUrls: ['./dettaglio-provvedimento.component.css']
})
export class DettaglioProvvedimentoComponent implements OnInit {

  procedimento: any;
  aziende: string[];

  constructor(private service: DefinizioneTipiProcedimentoService ) {
    // Il procedimento viene passato dall'interfaccia principale. Qua recupero solo le associazioni con le aziende.
    this.procedimento = {
      idTipoProcedimento: 3,
      nomeTipoProcedimento: 'nome azienda a caso',
      descrizioneTipoProcedimentoDefault: ' qui invece la descrizione',
      modoApertura: 'apri come vuoi',
      normaRiferimento: '9999',
      dataInizioValidita: new Date(),
      dataFineValidita: '',
      durataMassimaSospensione: '',
      aziendeAssociate: new Array()
    }
    this.aziende = ['AUSLBO', 'AOSPBO', 'IOR', 'AUSLIMOLA', 'AOSPFE', 'AUSLFE', 'AUSLPARMA'];
    // TODO:  da commentare la parte sottostante
    let auslbo = {
      nome: 'AUSL BO',
      associata: false
    }
    this.getAziendeAssociate();
    // this.procedimento.aziendeAssociate['AUSL BO'] = auslbo;
  }

  ngOnInit() {
  }

  associaDisassocia(azienda: string){
    if(this.procedimento.aziendeAssociate[azienda]){
      // TODO: Chiamata al server per la disassociazione
      this.procedimento.aziendeAssociate[azienda] = undefined;
      // this.procedimento.aziendeAssociate[azienda].associata = !this.procedimento.aziendeAssociate[azienda].associata;
    }else{
      // TODO: Chiamata al server per la l'associazione
      this.procedimento.aziendeAssociate[azienda] = {azienda};
    }
  }



  getAziendeAssociate() {
    this.service.getAziendeAssociateRequest(this.procedimento.idTipoProcedimento)
                            .toPromise()
                            .then(response => response.forEach(a => {
                              this.procedimento.aziendeAssociate[a.idAzienda.nome] = a.idAzienda;
                            }));
  }

  // isAssociata(azienda: string) : boolean {
  //   console.log('Azienda: ', azienda)
  //   return this.procedimento.aziendeAssociate[azienda];
  // }

}
