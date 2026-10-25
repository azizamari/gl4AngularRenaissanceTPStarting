import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { APP_ROUTES } from '../../../config/routes.config';

export const authGuard: CanActivateFn = () =>
  inject(AuthService).isAuthenticated() ||
  inject(Router).createUrlTree([APP_ROUTES.login]);
