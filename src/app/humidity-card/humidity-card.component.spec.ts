import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HumidityCardComponent } from './humidity-card.component';

describe('HumidityCardComponent', () => {
  let component: HumidityCardComponent;
  let fixture: ComponentFixture<HumidityCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HumidityCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HumidityCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
