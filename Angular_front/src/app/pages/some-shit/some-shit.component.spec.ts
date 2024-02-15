import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SomeShitComponent } from './some-shit.component';

describe('SomeShitComponent', () => {
  let component: SomeShitComponent;
  let fixture: ComponentFixture<SomeShitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SomeShitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SomeShitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
