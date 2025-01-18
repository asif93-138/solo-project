import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/userServices/user.service';
import { GlobalStateService } from '../services/globalServices/global-state.service';
import { ToastersComponent } from './toasters/toasters.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ToastersComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  authenticationService = inject(UserService);
  globalStateService = inject(GlobalStateService);

  applyForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    pass: new FormControl(''),
  });

  showRegisterToaster = false;
  showErrorToaster = false;

  uniqueEmailWarning = false;
  passwordWarning = false;

  constructor(private stateService: GlobalStateService, private router: Router) { }

  openToaster(type: string): void {
    if (type === 'register') this.showRegisterToaster = true;
    if (type === 'error') this.showErrorToaster = true;
    this.closeToaster(type);
  }

  closeToaster(type: string, delay: number = 2500): void {
    setTimeout(() => {
      if (type === 'register') this.showRegisterToaster = false;
      if (type === 'error') this.showErrorToaster = false;
    }, delay);
  }

  async submitApplication() {
    if (this.applyForm.value.name && this.applyForm.value.email && this.applyForm.value.pass) {
      if (this.applyForm.value.pass.length <= 7) {
        this.passwordWarning = true;
        return;
      }

      const res = await this.authenticationService.userRegistration({
        name: this.applyForm.value.name,
        email: this.applyForm.value.email,
        password: this.applyForm.value.pass
      });

      if (res.user_id) {
        localStorage.clear();
        localStorage.setItem('user_id', res.user_id);
        localStorage.setItem('name', res.name);
        localStorage.setItem('email', res.email);
        this.globalStateService.setUser(res);
        this.openToaster('register');
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 3000);
        this.applyForm.reset();
      } else if (res.error === 'Email is already in use') {
        this.uniqueEmailWarning = true;
      }
    } else this.openToaster('error');
  }
}
