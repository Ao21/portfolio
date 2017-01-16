import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { IntroductionModule } from './components/introduction/introduction.module';

import { MdCoreModule } from './core/';
import { routing, APP_ROUTING_PROVIDERS } from './app.routes';

import { AboutPageModule } from './pages/about-page/about-page.module';
import { NavigationModule } from './components/navigation/navigation.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MdCoreModule.forRoot(),
    routing,
    NavigationModule,
    IntroductionModule,
    AboutPageModule

  ],
  providers: [
    APP_ROUTING_PROVIDERS,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
