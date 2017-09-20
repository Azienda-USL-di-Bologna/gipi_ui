import { Component, OnInit } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import { DefinizioneTipiProcedimentoService } from './definizione-tipi-procedimento.service';
import {UtilityFunctions} from '../utility-functions';


@Component({
  selector: 'app-definizione-tipi-procedimento',
  templateUrl: './definizione-tipi-procedimento.component.html',
  styleUrls: ['./definizione-tipi-procedimento.component.css']
})
export class DefinizioneTipiProcedimentoComponent {

  private dataSource: DataSource;
  

  constructor(private service: DefinizioneTipiProcedimentoService, private utilityFunctions: UtilityFunctions) {
    this.dataSource = this.service.getTipiProcedimentoSource();
    debugger;
    console.log(this.dataSource);

  }

  private handleEvent(name: String, event: Event) {


    //console.log(name, event);

  }

  private laData(roba: any){
    return roba.toString()+"!!!";

  }

  private calcolaSeAttiva(coso: any){
    //console.log(coso);
    //debugger;
    var attivo: String;
    

    var utilityFunctions2 = new UtilityFunctions();

    //var prova:boolean;
    //prova = utilityFunctions2.isDataBiggerOrEqual(new Date(), new Date());

    if(utilityFunctions2.isDataBiggerOrEqual(new Date(),coso.dataInizioValidita) && coso.dataInizioValidita!= null)
      attivo = "Sì";
    else
      attivo = "No";


    if((utilityFunctions2.isDataBiggerOrEqual(coso.dataFineValidita, new Date()) || coso.dataFineValidita==null) && attivo=="Sì")
      attivo = "Sì";
    else
      attivo = "No";

    return attivo;
    
  }





}
