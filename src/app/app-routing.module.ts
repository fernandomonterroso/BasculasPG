import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { NonAuthGuard } from './guards/non-auth.guard';
import { AuthGuard } from './guards/auth.guard';
import { LandingComponent } from './pages/landing/landing.component';
import { BasculasComponent } from './pages/basculas/basculas.component';
import { PesajeComponent } from './pages/pesaje/pesaje.component';

export const routes: Routes = [
    // {
    //     path: '',
    //     component: LandingComponent,
    //     canActivate: [AuthGuard],
    // },
    {
        path: 'basculas',
        component: BasculasComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'pesaje',
        component: PesajeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [NonAuthGuard]
    },
    {path: '**', redirectTo: 'login'}
];
