import { Component, OnInit } from '@angular/core';
import { TipoProcedimento } from '../../../classi/tipo-procedimento';

@Component({
  selector: 'app-procedimento',
  templateUrl: './procedimento.component.html',
  styleUrls: ['./procedimento.component.css']
})
export class ProcedimentoComponent implements OnInit {

  mode : string = 'VISUAL-MODE';
  procedimento : TipoProcedimento;

  constructor() {
    this.procedimento = new TipoProcedimento();
    this.procedimento.descrizioneTipoProcedimentoDefault = 'descrizione a caso';
    this.procedimento.modoApertura = 'questo è il modo apertura';
    this.procedimento.normaRiferimento = 'norma 99/2a';
    this.procedimento.durataMassimaSospensione = '22';
    this.procedimento.dataInizioValidita = new Date();
    this.procedimento.dataFineValidita = new Date();
  }



  ngOnInit() {
  }

  switchMode(){
    // console.log('switch')
    this.mode = 'EDIT-MODE';
  }

}
