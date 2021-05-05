import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeButtonDialogComponent } from './three-button-dialog.component';

describe('ThreeButtonDialogComponent', () => {
  let component: ThreeButtonDialogComponent;
  let fixture: ComponentFixture<ThreeButtonDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreeButtonDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeButtonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
