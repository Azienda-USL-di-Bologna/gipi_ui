import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IterProcedimentoComponent } from './iter-procedimento.component';

describe('IterProcedimentoComponent', () => {
  let component: IterProcedimentoComponent;
  let fixture: ComponentFixture<IterProcedimentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IterProcedimentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IterProcedimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
