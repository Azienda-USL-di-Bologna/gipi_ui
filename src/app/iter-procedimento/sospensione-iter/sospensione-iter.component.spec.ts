import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SospensioneIterComponent } from './sospensione-iter.component';

describe('SospensioneIterComponent', () => {
  let component: SospensioneIterComponent;
  let fixture: ComponentFixture<SospensioneIterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SospensioneIterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SospensioneIterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
