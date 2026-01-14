import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyGenericTable } from './my-generic-table';

describe('MyGenericTable', () => {
  let component: MyGenericTable;
  let fixture: ComponentFixture<MyGenericTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyGenericTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyGenericTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
