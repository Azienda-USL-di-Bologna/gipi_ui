import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestioneAssociazioneAziendaComponent } from './gestione-associazione-azienda.component';

describe('AziendeTipiProcedimentoComponent', () => {
  let component: GestioneAssociazioneAziendaComponent;
  let fixture: ComponentFixture<GestioneAssociazioneAziendaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestioneAssociazioneAziendaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestioneAssociazioneAziendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
