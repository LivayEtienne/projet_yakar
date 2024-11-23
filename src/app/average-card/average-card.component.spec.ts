import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AverageCardComponent } from './average-card.component';

describe('AverageCardComponent', () => {
  let component: AverageCardComponent;
  let fixture: ComponentFixture<AverageCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AverageCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AverageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
