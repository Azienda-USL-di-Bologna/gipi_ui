import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PassaggioDiFaseComponent } from './passaggio-di-fase.component';

describe('PassaggioDiFaseComponent', () => {
  let component: PassaggioDiFaseComponent;
  let fixture: ComponentFixture<PassaggioDiFaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassaggioDiFaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassaggioDiFaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
