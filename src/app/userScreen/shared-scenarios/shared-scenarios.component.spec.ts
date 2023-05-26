import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedScenariosComponent } from './shared-scenarios.component';

describe('SharedScenariosComponent', () => {
  let component: SharedScenariosComponent;
  let fixture: ComponentFixture<SharedScenariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedScenariosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedScenariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
