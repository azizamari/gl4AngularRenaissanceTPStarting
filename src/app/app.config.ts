import { ApplicationConfig, inject, isDevMode, provideAppInitializer, provideZoneChangeDetection } from "@angular/core";
import { provideHttpClient, withInterceptors, withXhr } from "@angular/common/http";
import { provideRouter, withPreloading } from "@angular/router";
import { provideServiceWorker } from "@angular/service-worker";
import { provideToastr } from "ngx-toastr";

import { routes } from "./app.routes";
import { authInterceptor } from "./auth/interceptors/auth.interceptor";
import { AuthService } from "./auth/services/auth.service";
import { CustomPreloadingStrategy } from "./strategies/custom-preloading.strategy";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection(),
    provideRouter(routes, withPreloading(CustomPreloadingStrategy)),
    provideHttpClient(withXhr(), withInterceptors([authInterceptor])),
    provideAppInitializer(() => inject(AuthService).restoreSession()),
    provideToastr(),
    provideServiceWorker("ngsw-worker.js", {
      enabled: !isDevMode(),
      registrationStrategy: "registerWhenStable:30000",
    }),
  ],
};
