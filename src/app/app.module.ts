import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgxCsvParserModule } from 'ngx-csv-parser';
import { AgGridModule } from 'ag-grid-angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { GoogleComponent } from '../google/google.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AgGridModule,
    NgxCsvParserModule,
  ],
  declarations: [AppComponent, GoogleComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
