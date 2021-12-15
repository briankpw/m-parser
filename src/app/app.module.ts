import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgxCsvParserModule } from 'ngx-csv-parser';
import { AgGridModule } from 'ag-grid-angular';
// import { MatDatepickerModule } from '@angular/material/datepicker';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { GoogleComponent } from './google/google.component';
import { WechatComponent } from './wechat/wechat.component';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    AppRoutingModule,
    AgGridModule,
    NgxCsvParserModule,
    // MatDatepickerModule,
  ],
  declarations: [AppComponent, GoogleComponent, WechatComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
