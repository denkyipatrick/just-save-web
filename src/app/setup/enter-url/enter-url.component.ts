import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-enter-url',
  templateUrl: './enter-url.component.html',
  styleUrls: ['./enter-url.component.scss']
})
export class EnterUrlComponent implements OnInit {
  form: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = new FormGroup({
      url: new FormControl(
        localStorage.getItem('local-server-url'),
        [Validators.required]
      )
    });
  }

  ngOnInit(): void {
  }

  saveUrl() {
    if (this.form.invalid) {
      return;
    }

    localStorage.setItem('local-server-url', this.form.value.url);
    this.router.navigate(['../find-company'], { relativeTo: this.route });
  }

}
