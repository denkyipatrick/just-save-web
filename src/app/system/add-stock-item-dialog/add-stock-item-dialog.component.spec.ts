import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStockItemDialogComponent } from './add-stock-item-dialog.component';

describe('AddStockItemDialogComponent', () => {
  let component: AddStockItemDialogComponent;
  let fixture: ComponentFixture<AddStockItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddStockItemDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStockItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
