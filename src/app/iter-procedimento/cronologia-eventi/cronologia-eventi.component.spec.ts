import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CronologiaEventiComponent } from './cronologia-eventi.component';

describe('CronologiaEventiComponent', () => {
  let component: CronologiaEventiComponent;
  let fixture: ComponentFixture<CronologiaEventiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CronologiaEventiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CronologiaEventiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
