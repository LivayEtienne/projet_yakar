import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Moyenne3Component } from './moyenne3.component';

describe('Moyenne3Component', () => {
  let component: Moyenne3Component;
  let fixture: ComponentFixture<Moyenne3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Moyenne3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Moyenne3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
