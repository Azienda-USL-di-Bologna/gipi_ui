import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-struttura-tipi-procedimento',
  templateUrl: './struttura-tipi-procedimento.component.html',
  styleUrls: ['./struttura-tipi-procedimento.component.css']
})
export class StrutturaTipiProcedimentoComponent implements OnInit {

  
  width: any;


  constructor() { }

  ngOnInit() {
  }


  screen(width) {
    return (width < 700) ? 'sm' : 'lg';
  }

}
