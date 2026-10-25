import { Injectable, computed, inject, signal } from '@angular/core';
import { CredentialsDto } from '../dto/credentials.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { HttpClient } from '@angular/common/http';
import { API } from '../../../config/api.config';
import { Observable, tap } from 'rxjs';
import { AuthUser } from '../model/auth-user';

interface AuthSession {
  token: string;
  user: AuthUser;
  expiresAt: number;
}

const SESSION_KEY = 'session';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  // Single source of truth, only writable from inside the service
  private session = signal<AuthSession | null>(null);

  readonly user = computed(() => this.session()?.user ?? null);
  readonly token = computed(() => this.session()?.token ?? null);
  readonly isAuthenticated = computed(() => this.session() !== null);

  login(credentials: CredentialsDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(API.login, credentials).pipe(
      tap((response) =>
        this.startSession({
          token: response.id,
          user: { id: response.userId, email: credentials.email },
          // Client clock only, so a server clock skew can't break the expiry check
          expiresAt: Date.now() + response.ttl * 1000,
        })
      )
    );
  }

  logout() {
    this.clearSession();
  }

  // Called once when the application starts (see app.config.ts)
  restoreSession() {
    const session = this.readStoredSession();
    if (session && session.expiresAt > Date.now()) {
      this.session.set(session);
    } else {
      this.clearSession();
    }
  }

  private startSession(session: AuthSession) {
    this.session.set(session);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  private clearSession() {
    this.session.set(null);
    localStorage.removeItem(SESSION_KEY);
  }

  private readStoredSession(): AuthSession | null {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null');
    } catch {
      return null;
    }
  }
}
