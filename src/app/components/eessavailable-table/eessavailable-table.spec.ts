import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EESSAvailableTable } from './eessavailable-table';

describe('EESSAvailableTable', () => {
  let component: EESSAvailableTable;
  let fixture: ComponentFixture<EESSAvailableTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EESSAvailableTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EESSAvailableTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
