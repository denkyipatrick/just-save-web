import { DialogModule } from './dialog/dialog.module';
import { MaterialComponentsModule } from './material-components.module';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { StartScreenComponent } from './start-screen/start-screen.component';
import { SignOutComponent } from './sign-out/sign-out.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    StartScreenComponent,
    SignOutComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    DialogModule,
    MatIconModule,
    MatRippleModule,
    AppRoutingModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialComponentsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
