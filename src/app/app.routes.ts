import { Routes, RouterModule } from '@angular/router';
import { GUARD_MODULES } from './core/guard/guard.modules';
import { RESOLVE_MODULES } from './core/resolve/resolve.modules';

import { AboutPageRoutes } from './pages/about-page/about-page.routes';

const APP_ROUTES: Routes = [
    ...AboutPageRoutes
];

export const APP_ROUTING_PROVIDERS: any[] = [
	...GUARD_MODULES,
	...RESOLVE_MODULES
];

export const routing: any = RouterModule.forRoot(APP_ROUTES);


