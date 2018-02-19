import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipiProcedimentoAziendaliComponent } from './tipi-procedimento-aziendali.component';

describe('TipiProcedimentoAziendaliComponent', () => {
  let component: TipiProcedimentoAziendaliComponent;
  let fixture: ComponentFixture<TipiProcedimentoAziendaliComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipiProcedimentoAziendaliComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipiProcedimentoAziendaliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
