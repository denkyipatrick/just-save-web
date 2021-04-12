import { SignOutComponent } from './sign-out/sign-out.component';
import { StartScreenComponent } from './start-screen/start-screen.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'out', component: SignOutComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'start', component: StartScreenComponent },
  { path: 'setup', loadChildren: () => import('./setup/setup.module').then(m => m.SetupModule) },
  { path: 'system', loadChildren: () => import('./system/system.module').then(m => m.SystemModule) },
  { path: '', redirectTo: 'start', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
