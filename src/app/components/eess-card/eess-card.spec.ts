import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EessCard } from './eess-card';

describe('EessCard', () => {
  let component: EessCard;
  let fixture: ComponentFixture<EessCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EessCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EessCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
