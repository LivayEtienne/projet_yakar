import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Moyenne2Component } from './moyenne2.component';

describe('Moyenne2Component', () => {
  let component: Moyenne2Component;
  let fixture: ComponentFixture<Moyenne2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Moyenne2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Moyenne2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
