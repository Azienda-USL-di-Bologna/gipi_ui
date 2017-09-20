import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dettaglio-provvedimento',
  templateUrl: './dettaglio-provvedimento.component.html',
  styleUrls: ['./dettaglio-provvedimento.component.css']
})
export class DettaglioProvvedimentoComponent implements OnInit {

  procedimento: any;
  aziende: string[];

  constructor() {
    this.procedimento = {
      nomeTipoProcedimento: 'nome azienda a caso',
      descrizioneTipoProcedimentoDefault: ' qui invece la descrizione',
      modoApertura: 'apri come vuoi',
      normaRiferimento: '9999',
      dataInizioValidita: new Date(),
      dataFineValidita: '',
      durataMassimaSospensione: '',
      aziendeAssociate: new Array()
    }
    this.aziende = ['AUSL BO', 'AOSP BO', 'IOR', 'AUSL IMOLA', 'AOSP FE', 'AUSL FE', 'AUSL PARMA'];
    // TODO:  da commentare la parte sottostante
    let auslbo = {
      nome: 'AUSL BO',
      associata: false
    }
    this.procedimento.aziendeAssociate['AUSL BO'] = auslbo;
  }

  ngOnInit() {
  }

  associaDisassocia(azienda: string){
    console.log('Azienda', azienda);
    if(this.procedimento.aziendeAssociate[azienda]){
      this.procedimento.aziendeAssociate[azienda].associata = !this.procedimento.aziendeAssociate[azienda].associata;
    }else{
      this.procedimento.aziendeAssociate[azienda] = {nome: azienda, associata: true};
    }
  }

}
