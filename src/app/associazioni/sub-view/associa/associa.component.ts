import { Component, OnInit, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-associa',
  templateUrl: './associa.component.html',
  styleUrls: ['./associa.component.css']
})
export class AssociaComponent implements OnInit {

  constructor(public viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
  }

  public doneClick() {

  }
}
