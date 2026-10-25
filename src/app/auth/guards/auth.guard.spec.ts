import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { signal } from '@angular/core';

import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  const isAuthenticated = signal(false);

  const executeGuard = () =>
    TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: { isAuthenticated } }],
    });
  });

  it('should allow an authenticated user', () => {
    isAuthenticated.set(true);
    expect(executeGuard()).toBeTrue();
  });

  it('should redirect an anonymous user to the login page', () => {
    isAuthenticated.set(false);
    const result = executeGuard() as UrlTree;
    expect(result.toString()).toBe('/login');
  });
});
