import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Moyenne1Component } from './moyenne1.component';

describe('Moyenne1Component', () => {
  let component: Moyenne1Component;
  let fixture: ComponentFixture<Moyenne1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Moyenne1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Moyenne1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
