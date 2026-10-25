import { ComponentFixture, TestBed } from '@angular/core/testing';
import { computed, signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';

import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../auth/services/auth.service';
import { AuthUser } from '../../auth/model/auth-user';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  const user = signal<AuthUser | null>(null);

  beforeEach(async () => {
    user.set(null);
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideRouter([]),
        provideToastr(),
        {
          provide: AuthService,
          useValue: { user, isAuthenticated: computed(() => user() !== null) },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should react to the authentication state', () => {
    const text = () => (fixture.nativeElement as HTMLElement).textContent;
    expect(text()).toContain('Login');

    user.set({ id: 1, email: 'aymen@gmail.com' });
    fixture.detectChanges();

    expect(text()).toContain('aymen@gmail.com');
    expect(text()).toContain('Logout');
    expect(text()).not.toContain('Login');
  });
});
