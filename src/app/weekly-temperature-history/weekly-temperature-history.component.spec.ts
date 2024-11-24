import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyTemperatureHistoryComponent } from './weekly-temperature-history.component';

describe('WeeklyTemperatureHistoryComponent', () => {
  let component: WeeklyTemperatureHistoryComponent;
  let fixture: ComponentFixture<WeeklyTemperatureHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyTemperatureHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklyTemperatureHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
