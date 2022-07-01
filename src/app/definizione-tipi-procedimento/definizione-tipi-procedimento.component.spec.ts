import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefinizioneTipiProcedimentoComponent } from './definizione-tipi-procedimento.component';

describe('DefinizioneTipiProcedimentoComponent', () => {
  let component: DefinizioneTipiProcedimentoComponent;
  let fixture: ComponentFixture<DefinizioneTipiProcedimentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefinizioneTipiProcedimentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefinizioneTipiProcedimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
