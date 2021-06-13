import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Ng2ChartsWrapperModule, SingleDataSetComponent } from 'ng2-charts-wrapper';
import { ChartsModule } from 'ng2-charts';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AppComponent } from './app.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    Ng2ChartsWrapperModule,
    ChartsModule,
    NgxSpinnerModule
  ],
  providers: [
    SingleDataSetComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// export function httpClientFactory(http: HttpClient) => {
  
// }

// TranslateModule.forRoot({
//   loader: {
//     provide: TranslateLoader,
//     // useFactory: HttpLoaderFactory,
//     deps: [HttpClient]
//   }
// })