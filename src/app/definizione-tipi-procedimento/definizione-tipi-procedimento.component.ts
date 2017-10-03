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

  private handleEvent(name: String, event: any) {
    console.log(name, event);
    switch(name){
      case "CellClick":
        this.cellClick(event);
        break;
      
      case "ButtonClick":
        console.log("button click");
      
        console.log(event);
        break;

      case "associaClicked":
        console.log("entrato in associaClicked");
        break;

      case "editClicked":
        console.log("entrato in editClicked");
        break;

      case "deleteClicked":
        console.log("entrato in deleteClicked");
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
      if(element.name==="addRowButton")
      {
        element.options.hint="Aggiungi";
        element.options.text="Aggiungi";
        element.options.showText="always"
      }

           
    });

  }

  private onCellPrepared(e: any) {
    
    if (e.rowType === "data" && e.column.command === "edit") {
        var isEditing = e.row.isEditing,
            $links = e.cellElement.find(".dx-link");

        $links.text("");
        $links.filter(".dx-link-edit").addClass("dx-icon-edit");
        $links.filter(".dx-link-delete").addClass("dx-icon-trash");     
          
    }
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
    else if (row.dataInizioValidita <= row.dataFineValidita && row.dataFineValidita>=now)
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
