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
  private texts: Object={
    editRow:"Modifica",
    deleteRow:"Elimina",
    saveRowChanges:"Salva",
    cancelRowChanges:"Annulla",
    deleteRow: "Cancella",
    confirmDeleteMessage: "Stai per cancellare il tipo di procedimento: procedere?"
  }

  private loggaContesto(e: Object){
    console.log(e);
    
  }

  constructor(private service: DefinizioneTipiProcedimentoService) {
    this.dataSource = this.service.getTipiProcedimentoSource();
    //debugger;
    console.log(this.dataSource);

  }

  private handleEvent(name: String, event: Event) {
    console.log(name, event);
    switch(name){
      case "CellClick":
        this.cellClick(event);
        break;
      
      case "ButtonClick":
        console.log("button click");
      
        console.log(event);
        break;

    }

  }


  private cellClick(e: any){
    this.service.valorizzaSelectedRow(e.data);

  }

  private onToolbarPreparing(e: any){
    console.log("onToolbarPreparing event!!!")
    var toolbarItems = e.toolbarOptions.items;

    toolbarItems.forEach(element => {
      console.log(element);
      if(element.name==="addRowButton")
      {
        element.options.hint="Aggiungi";
        element.options.text="Aggiungi";
        element.options.showText="always"
        console.log(element);
      }

           
    });

  }

  private filterOperationDescriptions: Object = {"contains": "contiene", "notContains": "non contiene", "equal":"uguale", "notEqual":"diverso",
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
