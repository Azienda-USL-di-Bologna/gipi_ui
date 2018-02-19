import { Component, OnInit, Input } from "@angular/core";
import { TipoProcedimento } from "../../classi/server-objects/entities/tipo-procedimento";
import { Procedimento } from "../../classi/server-objects/entities/procedimento";

@Component({
  selector: "dettaglio-tipo-procedimento",
  templateUrl: "./dettaglio-tipo-procedimento.component.html",
  styleUrls: ["./dettaglio-tipo-procedimento.component.scss"]
})
export class DettaglioTipoProcedimentoComponent implements OnInit {
  public proc: Procedimento;

  @Input()
  set procedimento(procedimento: Procedimento) {
    console.log("SOno nell'@Input");
    this.proc = procedimento;
  }

  constructor() {
    console.log("constructor = DettaglioTipoProcedimento");
    console.log("this.procedimento ---> ", this.procedimento);
    console.log("this.proc ---> ", this.proc);
   }

  ngOnInit() {
    
  }

}
