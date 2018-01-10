import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaIterComponent } from './lista-iter.component';

describe('ListaIterComponent', () => {
  let component: ListaIterComponent;
  let fixture: ComponentFixture<ListaIterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaIterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaIterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
