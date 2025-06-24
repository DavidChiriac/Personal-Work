import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { IUser } from '../interfaces/User.interface';

export const authGuard: CanActivateFn = (route) => {
  const oauthService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  const requiredRoles = route.data['roles'];
  return oauthService.currentUser$.pipe(
    map((user: IUser | null) => {
      if (user) {
        let accessAllowed = !requiredRoles || requiredRoles.length === 0;

        if(requiredRoles && requiredRoles.length > 0){
          accessAllowed = user.roleNames.some((role) => requiredRoles.includes(role));
        }
        
        if(accessAllowed) {
          return true;
        } else {
          router.navigate(['']);
          return false;
        }
      }
      oauthService.onLogout.emit();
      router.navigate(['/login']);
      return false;
    }),
    catchError(() => {
      oauthService.onLogout.emit();
      router.navigate(['/login']);
      return of(false);
    })
  );
};
