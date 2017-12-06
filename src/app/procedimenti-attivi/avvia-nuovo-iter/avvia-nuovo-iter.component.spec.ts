import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvviaNuovoIterComponent } from './avvia-nuovo-iter.component';

describe('AvviaNuovoIterComponent', () => {
  let component: AvviaNuovoIterComponent;
  let fixture: ComponentFixture<AvviaNuovoIterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvviaNuovoIterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvviaNuovoIterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
