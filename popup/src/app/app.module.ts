//MODULES:
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';

//COMPONENTS:
import { AppComponent } from './app.component';
import { DialogComponent } from './shared/components/dialog/dialog.component';
import { FormComponent } from './form/form.component';

@NgModule({
  declarations: [AppComponent, FormComponent],
  imports: [BrowserModule, BrowserAnimationsModule, SharedModule],
  entryComponents: [DialogComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
