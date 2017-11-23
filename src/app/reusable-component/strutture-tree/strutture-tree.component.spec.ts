import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StruttureTreeComponent } from './strutture-tree.component';

describe('StruttureTreeComponent', () => {
  let component: StruttureTreeComponent;
  let fixture: ComponentFixture<StruttureTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StruttureTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StruttureTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
