import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvviaNuovoIterDaDocumentoComponent } from './avvia-nuovo-iter-da-documento.component';

describe('AvviaNuovoIterDaDocumentoComponent', () => {
  let component: AvviaNuovoIterDaDocumentoComponent;
  let fixture: ComponentFixture<AvviaNuovoIterDaDocumentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvviaNuovoIterDaDocumentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvviaNuovoIterDaDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
