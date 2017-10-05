import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[associa-host]'
})
export class AssociaDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
