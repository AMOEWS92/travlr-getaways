import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BROWSER_STORAGE } from '../storage';
import { AuthResponse, User } from '../models/user';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private tokenKey = 'travlr-token';

  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) {}

  private saveToken(token: string) { this.storage.setItem(this.tokenKey, token); }
  getToken(): string | null { return this.storage.getItem(this.tokenKey); }
  logout() { this.storage.removeItem(this.tokenKey); }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    // simple presence check; JWT decode optional for exp checks
    return true;
  }

  register(name: string, email: string, password: string) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/register`, { name, email, password });
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/login`, { email, password });
  }

  handleAuthResponse(resp: AuthResponse) {
    if (resp && resp.token) this.saveToken(resp.token);
  }
}