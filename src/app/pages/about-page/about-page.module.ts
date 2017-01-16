import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutPageComponent } from './about-page.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    AboutPageComponent
  ],
  exports: [
    AboutPageComponent
  ]
})
export class AboutPageModule { }
