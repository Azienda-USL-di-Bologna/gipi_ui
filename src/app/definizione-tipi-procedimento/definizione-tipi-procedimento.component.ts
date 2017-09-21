import { Component, OnInit } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import { DefinizioneTipiProcedimentoService } from './definizione-tipi-procedimento.service';
//import { UtilityFunctions } from '../utility-functions';


@Component({
  selector: 'app-definizione-tipi-procedimento',
  templateUrl: './definizione-tipi-procedimento.component.html',
  styleUrls: ['./definizione-tipi-procedimento.component.css']
})
export class DefinizioneTipiProcedimentoComponent {

  private dataSource: DataSource;


  constructor(private service: DefinizioneTipiProcedimentoService) {
    this.dataSource = this.service.getTipiProcedimentoSource();
    //debugger;
    console.log(this.dataSource);

  }

  private handleEvent(name: String, event: Event) {
    switch(name){
      case "associaClicked":
      this.associaClicked(event);

        //QUA CI VA LA FUNZIONE CHE CHIAMA LA VIDEATA DI FAY
        break;

    }

  }

  private associaClicked(e: Event){
    console.log(e);
    this.service.valorizzaSelectedRow(e);
  
  }


  private filterOperationDescriptions: Object = {"contains": "contiene", "notcontains": "non contiene", "=":"uguale", "<>":"diverso",
    "startsWith":"comincia con",  "endsWith":"finisce con", "between":"compreso tra", "greaterThan":"maggiore di",
    "greaterThanOrEqual":"maggiore o uguale a","lessThan":"minore di", "lessThanOrEqual":"minore o uguale a" }


  private calcolaSeAttiva(row: any) {
    //console.log(coso);
    //debugger;

    //var utilityFunctions = new UtilityFunctions();

    var attivo: String;


    var daAttivare: boolean;

    var now = new Date();
    var today = now.getTime();

    if (row.dataInizioValidita == null)
      daAttivare = false;
    else if (row.dataInizioValidita > now)
      daAttivare = false;
    else if (row.dataFineValidita == null)
      daAttivare = true;
    else if (row.dataInizioValidita <= row.dataFineValidita)
      daAttivare = true;
    else
      daAttivare = false;

    //debugger;


    /*    if(utilityFunctions.isDataBiggerOrEqual(new Date(),coso.dataInizioValidita) && coso.dataInizioValidita!= null)
          attivo = "Sì";
        else
          attivo = "No";
    
    
        if((utilityFunctions.isDataBiggerOrEqual(coso.dataFineValidita, new Date()) || coso.dataFineValidita==null) && attivo=="Sì")
          attivo = "Sì";
        else
          attivo = "No";*/

    attivo = daAttivare ? 'Sì' : 'No'

    return attivo;

  }
}
