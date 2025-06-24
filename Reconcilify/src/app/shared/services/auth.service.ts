import { EventEmitter, Injectable } from '@angular/core';
import { IUser } from '../interfaces/User.interface';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppRolesEnum } from '../utils/app-roles';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  onLogout = new EventEmitter<void>();
  private currentUser = new BehaviorSubject<IUser | null>(null);
  private currentUserRoles: AppRolesEnum[] = [];
  // eslint-disable-next-line @typescript-eslint/member-ordering
  currentUser$ = this.currentUser.asObservable();

  constructor(private httpClient: HttpClient) {}

  login(): void {
    window.location.href = `${environment.envName === 'local' ? environment.apiUrl : window.location.origin}/oauth2/authorization/oidc`;
  }

  logout(): Observable<void> {
    return this.httpClient.post<void>(environment.apiUrl + '/api/logout', null);
  }

  getUserData(): Observable<IUser | null>{
    return this.httpClient.get<IUser>(environment.apiUrl + '/api/account');
  }

  setCurrentUser(user: IUser | null): void {
    this.currentUser.next(user);
    this.currentUserRoles = user?.roleNames ?? [];
  }

  getUserRoles(): AppRolesEnum[] {
    return this.currentUserRoles;
  }
}
