import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOrderProductQuantityDialogComponent } from './select-order-product-quantity-dialog.component';

describe('SelectOrderProductQuantityDialogComponent', () => {
  let component: SelectOrderProductQuantityDialogComponent;
  let fixture: ComponentFixture<SelectOrderProductQuantityDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectOrderProductQuantityDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectOrderProductQuantityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
