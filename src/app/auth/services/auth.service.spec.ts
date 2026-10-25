import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { API } from '../../../config/api.config';

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;

  const credentials = { email: 'aymen@gmail.com', password: 'secret' };
  const storedSession = (expiresAt: number) =>
    JSON.stringify({ token: 'abc', user: { id: 1, email: credentials.email }, expiresAt });

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => localStorage.clear());

  it('should start anonymous', () => {
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.user()).toBeNull();
  });

  it('should store the user after a successful login', () => {
    service.login(credentials).subscribe();
    httpTesting.expectOne(API.login).flush({
      id: 'abc',
      ttl: 3600,
      created: new Date(),
      userId: 1,
    });

    expect(service.isAuthenticated()).toBeTrue();
    expect(service.user()).toEqual({ id: 1, email: credentials.email });
    expect(service.token()).toBe('abc');
    expect(localStorage.getItem('session')).not.toBeNull();
  });

  it('should clear the state on logout', () => {
    localStorage.setItem('session', storedSession(Date.now() + 60_000));
    service.restoreSession();

    service.logout();

    expect(service.isAuthenticated()).toBeFalse();
    expect(localStorage.getItem('session')).toBeNull();
  });

  it('should restore a valid session', () => {
    localStorage.setItem('session', storedSession(Date.now() + 60_000));
    service.restoreSession();
    expect(service.user()).toEqual({ id: 1, email: credentials.email });
  });

  it('should drop an expired session', () => {
    localStorage.setItem('session', storedSession(Date.now() - 1));
    service.restoreSession();
    expect(service.isAuthenticated()).toBeFalse();
    expect(localStorage.getItem('session')).toBeNull();
  });

  it('should ignore a corrupted session', () => {
    localStorage.setItem('session', '{not json');
    service.restoreSession();
    expect(service.isAuthenticated()).toBeFalse();
  });
});
