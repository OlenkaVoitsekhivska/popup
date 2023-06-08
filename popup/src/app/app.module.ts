import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PopFormModule } from './pop-form/pop-form.module';
import { DialogComponent } from './shared/components/dialog/dialog.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, PopFormModule],
  entryComponents: [DialogComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
