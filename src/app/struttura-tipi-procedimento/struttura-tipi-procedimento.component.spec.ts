import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrutturaTipiProcedimentoComponent } from './struttura-tipi-procedimento.component';

describe('StrutturaTipiProcedimentoComponent', () => {
  let component: StrutturaTipiProcedimentoComponent;
  let fixture: ComponentFixture<StrutturaTipiProcedimentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrutturaTipiProcedimentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrutturaTipiProcedimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
