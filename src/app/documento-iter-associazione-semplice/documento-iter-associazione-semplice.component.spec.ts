import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoIterAssociazioneSempliceComponent } from './documento-iter-associazione-semplice.component';

describe('DocumentoIterAssociazioneSempliceComponent', () => {
  let component: DocumentoIterAssociazioneSempliceComponent;
  let fixture: ComponentFixture<DocumentoIterAssociazioneSempliceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentoIterAssociazioneSempliceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoIterAssociazioneSempliceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
