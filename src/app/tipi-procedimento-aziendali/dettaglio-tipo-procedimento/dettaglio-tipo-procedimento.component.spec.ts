import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioTipoProcedimentoComponent } from './dettaglio-tipo-procedimento.component';

describe('DettaglioTipoProcedimentoComponent', () => {
  let component: DettaglioTipoProcedimentoComponent;
  let fixture: ComponentFixture<DettaglioTipoProcedimentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DettaglioTipoProcedimentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DettaglioTipoProcedimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
