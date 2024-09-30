import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app-routing.module';
import { provideAnimations } from '@angular/platform-browser/animations'; // Cambiado a provideAnimations
import { provideHttpClient } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({
      eventCoalescing: true,
    }),
    provideRouter(routes),
    provideAnimations(),  // Cambiado a provideAnimations (sin async)
    provideHttpClient(),
    //importProvidersFrom(ToastrModule.forRoot({positionClass :'toast-bottom-right'})) //
    importProvidersFrom(ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true
    })) // Asegúrate de que esto esté configurado correctamente
  ],
};
