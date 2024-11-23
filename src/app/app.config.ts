import { ApplicationConfig } from '@angular/core';

import { provideRouter } from '@angular/router';

    
import { routes } from './app.routes';

import { provideAnimations } from '@angular/platform-browser/animations';

    

import { provideHttpClient } from '@angular/common/http';

     
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TokenInterceptor } from './interceptor/authInterceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), provideClientHydration(), provideAnimationsAsync(), [provideHttpClient(withFetch())],
    [provideHttpClient(withFetch())], 
    provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ]
};