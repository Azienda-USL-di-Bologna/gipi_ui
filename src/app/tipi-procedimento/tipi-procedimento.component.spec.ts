import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipiProcedimentoComponent } from './tipi-procedimento.component';

describe('TipiProcedimentoComponent', () => {
  let component: TipiProcedimentoComponent;
  let fixture: ComponentFixture<TipiProcedimentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipiProcedimentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipiProcedimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
