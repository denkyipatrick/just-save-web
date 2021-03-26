import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PleaseWaitDialogComponent } from './please-wait-dialog.component';

describe('PleaseWaitDialogComponent', () => {
  let component: PleaseWaitDialogComponent;
  let fixture: ComponentFixture<PleaseWaitDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PleaseWaitDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PleaseWaitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
