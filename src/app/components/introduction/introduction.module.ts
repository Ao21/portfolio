import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntroductionComponent } from './introduction.component';
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    IntroductionComponent
  ],
  exports: [
    IntroductionComponent
  ]
})
export class IntroductionModule { }
