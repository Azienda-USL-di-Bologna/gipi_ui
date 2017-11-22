import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcedimentiAttiviComponent } from './procedimenti-attivi.component';

describe('ProcedimentiAttiviComponent', () => {
  let component: ProcedimentiAttiviComponent;
  let fixture: ComponentFixture<ProcedimentiAttiviComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcedimentiAttiviComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcedimentiAttiviComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
