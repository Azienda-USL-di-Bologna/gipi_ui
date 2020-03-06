import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaIterPerDemiurgoComponent } from './lista-iter-per-demiurgo.component';

describe('ListaIterPerDemiurgoComponent', () => {
  let component: ListaIterPerDemiurgoComponent;
  let fixture: ComponentFixture<ListaIterPerDemiurgoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaIterPerDemiurgoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaIterPerDemiurgoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
