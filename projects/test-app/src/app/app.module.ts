import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FuiAccordionModule} from '../../../ngx-fomantic-ui/src/accordion/accordion.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FuiAccordionModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
