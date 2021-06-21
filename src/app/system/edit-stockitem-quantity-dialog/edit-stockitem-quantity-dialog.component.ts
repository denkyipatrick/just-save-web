import { StockService } from './../../services/stock.service';
import { FormGroup, FormControl } from '@angular/forms';
import { StockItem } from './../../models/stockitem';
import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-stockitem-quantity-dialog',
  templateUrl: './edit-stockitem-quantity-dialog.component.html',
  styleUrls: ['./edit-stockitem-quantity-dialog.component.scss']
})
export class EditStockitemQuantityDialogComponent implements OnInit {
  stockItem: StockItem;
  editType: string;
  quantityForm: FormGroup;
  isWorking: boolean;
  errorMessage: string;
  validationErrorMessages: string[] = [];
  @Output() updated: EventEmitter<StockItem>;

  constructor(
    private stockService: StockService,
    private dialogRef: MatDialogRef<EditStockitemQuantityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.updated = new EventEmitter();
    this.quantityForm = new FormGroup({
      quantity: new FormControl(0)
    });
  }

  ngOnInit(): void {
    this.editType = 'Add';
    this.stockItem = this.data?.stockItem;
  }

  close() {
    this.dialogRef.close();
  }

  changeQuantity() {
    if (this.quantityForm.invalid) {
      return;
    }

    this.isWorking = true;
    this.errorMessage = '';

    this.stockService.updateStockItemQuantity(this.stockItem.id, {
      editType: this.editType,
      quantity: this.quantityForm.value['quantity']
    })
    .subscribe(stockItem => {
      this.isWorking = false;
      this.updated.emit(stockItem);
      this.dialogRef.close();
    }, error => {
      this.isWorking = false;

      switch(error.status) {
        case 0: {
          this.errorMessage = "You may be offline.";
          break;
        }
        case 400: {
          this.errorMessage = "Validation Errors";
          this.validationErrorMessages = error.error.errors.map(err => err.msg);
          break;
        }
        default: {
          this.errorMessage = "An unknown error has occurred. Try again later.";
        }
      }
    });
  }

}
