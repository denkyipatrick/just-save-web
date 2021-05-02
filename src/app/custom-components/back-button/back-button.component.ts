import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss']
})
export class BackButtonComponent implements OnInit {
  @Output() clicked: EventEmitter<null>;
  @Input() cancelEvent: boolean = false;

  constructor() {
    this.clicked = new EventEmitter();
  }

  ngOnInit(): void {
  }

  goBack(): void {
    if (!this.cancelEvent) {
      history.back();
    }

    this.clicked.emit();
  }

}
