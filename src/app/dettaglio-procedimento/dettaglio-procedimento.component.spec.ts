import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioProcedimentoComponent } from './dettaglio-procedimento.component';

describe('DettaglioProcedimentoComponent', () => {
  let component: DettaglioProcedimentoComponent;
  let fixture: ComponentFixture<DettaglioProcedimentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DettaglioProcedimentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DettaglioProcedimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
