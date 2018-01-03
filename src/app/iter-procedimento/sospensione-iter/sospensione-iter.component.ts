import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "sospensione-iter",
  templateUrl: "./sospensione-iter.component.html",
  styleUrls: ["./sospensione-iter.component.scss"]
})
export class SospensioneIterComponent implements OnInit {

  @Input("params") params: any;
  @Output() messageEvent = new EventEmitter<Object>();
  public sospensioneParams: SospensioneParams = new SospensioneParams();

  constructor() { }

  ngOnInit() {
  }

}

class SospensioneParams {
  public codiceRegistroDocumento: string;
  public numeroDocumento: string;
  public annoDocumento: number;
  public sospesoDal: Date;
  public sospesoAl: Date;
  public note: string;
}