import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppStarComponent } from './app-star.component';

describe('AppStarComponent', () => {
  let component: AppStarComponent;
  let fixture: ComponentFixture<AppStarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppStarComponent]
    });
    fixture = TestBed.createComponent(AppStarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
