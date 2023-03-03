import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule, Routes } from '@angular/router';
import { NewScenarioComponent } from './new-scenario.component';

describe('NewScenarioComponent', () => {
  let component: NewScenarioComponent;
  let fixture: ComponentFixture<NewScenarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewScenarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewScenarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
