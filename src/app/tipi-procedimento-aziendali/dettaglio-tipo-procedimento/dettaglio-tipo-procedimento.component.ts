import { Component, OnInit, Input } from "@angular/core";
import { TipoProcedimento } from "../../classi/server-objects/entities/tipo-procedimento";

@Component({
  selector: "dettaglio-tipo-procedimento",
  templateUrl: "./dettaglio-tipo-procedimento.component.html",
  styleUrls: ["./dettaglio-tipo-procedimento.component.scss"]
})
export class DettaglioTipoProcedimentoComponent implements OnInit {

  @Input()
  set procedimento(procedimento: any) {

  }

  constructor() { }

  ngOnInit() {
  }

}
