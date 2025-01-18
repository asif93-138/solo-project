import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/userServices/user.service';
import { GlobalStateService } from '../services/globalServices/global-state.service';
import { ToastersComponent } from './toasters/toasters.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ToastersComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  authenticationService = inject(UserService);
  globalStateService = inject(GlobalStateService);

  applyForm = new FormGroup({
    email: new FormControl(''),
    pass: new FormControl(''),
  });

  loggedInStatus = false;
  showLoginToaster = false;
  showErrorToaster = false;

  showMatchError = false;
  showRegisterError = false;

  constructor(private stateService: GlobalStateService, private router: Router) {
    this.stateService.user$.subscribe((user) => {
      if (user) {
        this.loggedInStatus = true;
      }
    });
  }

  openToaster(type: string): void {
    if (type === 'login') this.showLoginToaster = true;
    if (type === 'error') this.showErrorToaster = true;
    this.closeToaster(type);
  }

  closeToaster(type: string, delay: number = 2500): void {
    setTimeout(() => {
      if (type === 'login') this.showLoginToaster = false;
      if (type === 'error') this.showErrorToaster = false;
    }, delay);
  }

  // async submitApplication() {
  //   if (this.applyForm.value.email && this.applyForm.value.pass) {
  //     const response = await this.authenticationService.userLogin(this.applyForm.value.email, this.applyForm.value.pass);
  //     if (response.user_id && response.password == this.applyForm.value.pass) {
  //       localStorage.clear();
  //       localStorage.setItem('user_id', response.user_id);
  //       localStorage.setItem('name', response.name);
  //       localStorage.setItem('email', response.email);
  //       this.globalStateService.setUser(response);
  //       this.openToaster('login');
  //       setTimeout(() => {
  //         this.router.navigate(['/']);
  //       }, 3000);
  //       this.applyForm.reset();
  //     }
  //   } else {
  //     this.openToaster('error');
  //   }
  // }
  async submitApplication() {
    if (this.applyForm.value.email && this.applyForm.value.pass) {
      const response = await this.authenticationService.userLogin(this.applyForm.value.email, this.applyForm.value.pass);

      // Check for user registration errors
      if (response.error) {
        this.showRegisterError = true;
        this.showMatchError = false;
        this.applyForm.reset(); // Reset form fields on error
      }
      // Check if the password matches
      else if (response.password == this.applyForm.value.pass) {
        this.showMatchError = false;
        this.showRegisterError = false;
        localStorage.clear();
        localStorage.setItem('user_id', response.user_id);
        localStorage.setItem('name', response.name);
        localStorage.setItem('email', response.email);
        this.globalStateService.setUser(response);
        this.openToaster('login');
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 3000);
        this.applyForm.reset();
      } else {
        // Password doesn't match
        this.showMatchError = true;
        this.showRegisterError = false;
      }
    } else {
      // If form is invalid or missing data
      this.openToaster('error');
    }
  }
}
