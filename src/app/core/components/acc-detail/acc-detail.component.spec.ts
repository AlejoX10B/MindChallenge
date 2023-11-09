import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccDetailComponent } from './acc-detail.component';

describe('AccDetailComponent', () => {
  let component: AccDetailComponent;
  let fixture: ComponentFixture<AccDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccDetailComponent]
    });
    fixture = TestBed.createComponent(AccDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
