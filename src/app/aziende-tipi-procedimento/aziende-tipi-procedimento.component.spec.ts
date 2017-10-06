import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AziendeTipiProcedimentoComponent } from './aziende-tipi-procedimento.component';

describe('AziendeTipiProcedimentoComponent', () => {
  let component: AziendeTipiProcedimentoComponent;
  let fixture: ComponentFixture<AziendeTipiProcedimentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AziendeTipiProcedimentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AziendeTipiProcedimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
