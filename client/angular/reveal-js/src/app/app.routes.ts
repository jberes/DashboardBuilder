import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './error-routing/not-found/not-found.component';
import { UncaughtErrorComponent } from './error-routing/error/uncaught-error.component';
import { BuilderComponent } from './builder/builder.component';

export const routes: Routes = [
	{ path: '', redirectTo: 'builder', pathMatch: 'full' },
  { path: 'error', component: UncaughtErrorComponent },
  { path: 'builder', component: BuilderComponent, data: { text: 'Builder' } },
  { path: '**', component: PageNotFoundComponent } // must always be last
];
