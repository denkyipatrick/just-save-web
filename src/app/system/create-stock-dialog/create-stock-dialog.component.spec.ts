import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStockDialogComponent } from './create-stock-dialog.component';

describe('CreateStockDialogComponent', () => {
  let component: CreateStockDialogComponent;
  let fixture: ComponentFixture<CreateStockDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateStockDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStockDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
