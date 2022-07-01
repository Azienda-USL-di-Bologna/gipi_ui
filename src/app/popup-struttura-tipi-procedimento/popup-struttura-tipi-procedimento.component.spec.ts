import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupStrutturaTipiProcedimentoComponent } from './popup-struttura-tipi-procedimento.component';

describe('PopupStrutturaTipiProcedimentoComponent', () => {
  let component: PopupStrutturaTipiProcedimentoComponent;
  let fixture: ComponentFixture<PopupStrutturaTipiProcedimentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupStrutturaTipiProcedimentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupStrutturaTipiProcedimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
