import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavMenuComponent } from './nav-menu/nav-menu.component';

import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { GestureConfig } from './../../core/gestures/gesture-config';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    NavMenuComponent
  ],
  exports: [
    NavMenuComponent
  ],
  providers: [
    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig }
  ]
})
export class NavigationModule { }
