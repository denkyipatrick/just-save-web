import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockEntryDetailComponent } from './stock-entry-detail.component';

describe('StockEntryDetailComponent', () => {
  let component: StockEntryDetailComponent;
  let fixture: ComponentFixture<StockEntryDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockEntryDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockEntryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
