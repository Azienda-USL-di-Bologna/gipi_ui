import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaIterConPermessiComponent } from './lista-iter-con-permessi.component';

describe('ListaIterConPermessiComponent', () => {
  let component: ListaIterConPermessiComponent;
  let fixture: ComponentFixture<ListaIterConPermessiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaIterConPermessiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaIterConPermessiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
