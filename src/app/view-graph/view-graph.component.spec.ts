import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGraphComponent } from './view-graph.component';

describe('ViewGraphComponent', () => {
  let component: ViewGraphComponent;
  let fixture: ComponentFixture<ViewGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewGraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
