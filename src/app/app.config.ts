import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from "@angular/core";
import { provideHttpClient, withInterceptorsFromDi, withXhr } from "@angular/common/http";
import { provideRouter } from "@angular/router";
import { provideServiceWorker } from "@angular/service-worker";
import { provideToastr } from "ngx-toastr";

import { routes } from "./app.routes";
import { AuthInterceptorProvider } from "./auth/interceptors/auth.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withXhr(), withInterceptorsFromDi()),
    AuthInterceptorProvider,
    provideToastr(),
    provideServiceWorker("ngsw-worker.js", {
      enabled: !isDevMode(),
      registrationStrategy: "registerWhenStable:30000",
    }),
  ],
};
