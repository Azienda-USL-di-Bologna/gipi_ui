import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentiIterComponent } from './documenti-iter.component';

describe('DocumentiIterComponent', () => {
  let component: DocumentiIterComponent;
  let fixture: ComponentFixture<DocumentiIterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentiIterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentiIterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
