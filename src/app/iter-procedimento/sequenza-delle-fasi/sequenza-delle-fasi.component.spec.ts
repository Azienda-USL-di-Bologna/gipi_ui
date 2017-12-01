import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SequenzaDelleFasiComponent } from './sequenza-delle-fasi.component';

describe('SequenzaDelleFasiComponent', () => {
  let component: SequenzaDelleFasiComponent;
  let fixture: ComponentFixture<SequenzaDelleFasiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SequenzaDelleFasiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SequenzaDelleFasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
