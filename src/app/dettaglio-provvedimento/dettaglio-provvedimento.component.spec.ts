import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioProvvedimentoComponent } from './dettaglio-provvedimento.component';

describe('DettaglioProvvedimentoComponent', () => {
  let component: DettaglioProvvedimentoComponent;
  let fixture: ComponentFixture<DettaglioProvvedimentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DettaglioProvvedimentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DettaglioProvvedimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
