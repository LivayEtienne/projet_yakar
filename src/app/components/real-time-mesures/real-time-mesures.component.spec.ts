import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealTimeMesuresComponent } from './real-time-mesures.component';

describe('RealTimeMesuresComponent', () => {
  let component: RealTimeMesuresComponent;
  let fixture: ComponentFixture<RealTimeMesuresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealTimeMesuresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealTimeMesuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
