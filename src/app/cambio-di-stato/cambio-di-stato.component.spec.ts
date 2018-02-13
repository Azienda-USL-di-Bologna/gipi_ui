import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioDiStatoComponent } from './cambio-di-stato.component';

describe('CambioDiStatoComponent', () => {
  let component: CambioDiStatoComponent;
  let fixture: ComponentFixture<CambioDiStatoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CambioDiStatoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CambioDiStatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
