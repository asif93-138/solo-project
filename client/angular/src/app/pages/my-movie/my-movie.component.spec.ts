import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyMovieComponent } from './my-movie.component';

describe('MyMovieComponent', () => {
  let component: MyMovieComponent;
  let fixture: ComponentFixture<MyMovieComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyMovieComponent]
    });
    fixture = TestBed.createComponent(MyMovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
