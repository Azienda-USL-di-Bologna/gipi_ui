import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioDiStatoBoxComponent } from './cambio-di-stato-box.component';

describe('CambioDiStatoBoxComponent', () => {
  let component: CambioDiStatoBoxComponent;
  let fixture: ComponentFixture<CambioDiStatoBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CambioDiStatoBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CambioDiStatoBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
