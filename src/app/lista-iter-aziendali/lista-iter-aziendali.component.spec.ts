import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaIterAziendaliComponent } from './lista-iter-aziendali.component';

describe('ListaIterAziendaliComponent', () => {
  let component: ListaIterAziendaliComponent;
  let fixture: ComponentFixture<ListaIterAziendaliComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaIterAziendaliComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaIterAziendaliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
