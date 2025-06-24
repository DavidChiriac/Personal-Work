import { Component, HostListener } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { IUser } from '../shared/interfaces/User.interface';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Router } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: false
})
export class LoginComponent {
  containerHeight = window.innerHeight;
  currentUser!: IUser | null;

  constructor(private readonly authService: AuthService, private readonly router: Router) {
    authService.currentUser$.pipe(untilDestroyed(this)).subscribe((user) => {
      this.currentUser = user;

      if(user){
        this.router.navigate(['']);
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.containerHeight = window.innerHeight;
  }

  login(): void {
    if(this.currentUser) {
      this.router.navigate(['']);
    } else {
      this.authService.login();
    }
  }
}
