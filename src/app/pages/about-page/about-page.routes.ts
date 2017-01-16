import { Routes } from '@angular/router';
import { AboutPageComponent } from './about-page.component';

export const AboutPageRoutes: Routes = [
    {
		path: '',
		component: AboutPageComponent,
	},
	{
		path: 'about-me',
		component: AboutPageComponent,
	}
];
