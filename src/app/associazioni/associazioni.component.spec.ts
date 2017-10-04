import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociazioniComponent } from './associazioni.component';

describe('AssociazioniComponent', () => {
  let component: AssociazioniComponent;
  let fixture: ComponentFixture<AssociazioniComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociazioniComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociazioniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
