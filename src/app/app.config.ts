import { ApplicationConfig, inject, isDevMode, provideAppInitializer, provideZoneChangeDetection } from "@angular/core";
import { provideHttpClient, withInterceptors, withXhr } from "@angular/common/http";
import { provideRouter } from "@angular/router";
import { provideServiceWorker } from "@angular/service-worker";
import { provideToastr } from "ngx-toastr";

import { routes } from "./app.routes";
import { authInterceptor } from "./auth/interceptors/auth.interceptor";
import { AuthService } from "./auth/services/auth.service";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withXhr(), withInterceptors([authInterceptor])),
    provideAppInitializer(() => inject(AuthService).restoreSession()),
    provideToastr(),
    provideServiceWorker("ngsw-worker.js", {
      enabled: !isDevMode(),
      registrationStrategy: "registerWhenStable:30000",
    }),
  ],
};
