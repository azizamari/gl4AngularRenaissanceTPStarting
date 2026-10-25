import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';

import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';
import { API } from '../../../config/api.config';

describe('authInterceptor', () => {
  const token = signal<string | null>(null);
  const logout = jasmine.createSpy('logout');
  let http: HttpClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    logout.calls.reset();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: { token, logout } },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('should add the token to our API when the user is authenticated', () => {
    token.set('abc');
    http.get(API.cv).subscribe();
    expect(httpTesting.expectOne(API.cv).request.headers.get('Authorization')).toBe('abc');
  });

  it('should not add a token when the user is anonymous', () => {
    token.set(null);
    http.get(API.cv).subscribe();
    expect(httpTesting.expectOne(API.cv).request.headers.has('Authorization')).toBeFalse();
  });

  it('should never send the token to a third party API', () => {
    token.set('abc');
    http.get(API.products).subscribe();
    expect(httpTesting.expectOne(API.products).request.headers.has('Authorization')).toBeFalse();
  });

  it('should log the user out when the server rejects the token', () => {
    token.set('abc');
    http.get(API.cv).subscribe({ error: () => {} });
    httpTesting.expectOne(API.cv).flush(null, { status: 401, statusText: 'Unauthorized' });
    expect(logout).toHaveBeenCalled();
  });

  it('should keep the session on other errors', () => {
    token.set('abc');
    http.get(API.cv).subscribe({ error: () => {} });
    httpTesting.expectOne(API.cv).flush(null, { status: 500, statusText: 'Server Error' });
    expect(logout).not.toHaveBeenCalled();
  });
});
