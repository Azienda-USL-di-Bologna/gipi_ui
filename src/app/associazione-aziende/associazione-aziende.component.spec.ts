import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociazioneAziendeComponent } from './associazione-aziende.component';

describe('DettaglioProcedimentoComponent', () => {
  let component: AssociazioneAziendeComponent;
  let fixture: ComponentFixture<AssociazioneAziendeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociazioneAziendeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociazioneAziendeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
