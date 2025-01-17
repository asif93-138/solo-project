import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/userServices/user.service';
import { GlobalStateService } from '../services/globalServices/global-state.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="p-8">
      <form class="border-2 p-6 rounded-lg w-2/5 mx-auto mt-4" [formGroup]="applyForm" (submit)="submitApplication()">
        <p class="text-2xl mb-4 font-medium">Register</p>
        <label for="name" class="font-medium">Name</label><br />
        <input type="text" id="name" formControlName="name" class="border border-gray-400 rounded text-sm p-1 w-full" required /><br />
        <label for="email" class="font-medium">Email</label><br />
        <input type="email" id="email" formControlName="email" class="border border-gray-400 rounded text-sm p-1 w-full" required /><br />
        <!-- {showUniqueEmailWarn && <p class="text-red-600">This email is already used!</p>} -->
        <label for="pass" class="font-medium">Password</label><br />
        <input type="password" id="pass" formControlName="pass" class="border border-gray-400 rounded text-sm p-1 w-full" required /><br />
        <!-- <p id="passWarn" class={showPassWarn ? "text-red-600" : "text-red-600 hidden"}>Password must be at least 8 characters long!</p> -->
        <input type="submit" class="btn btn-warning my-4 w-full" value="Register" />
        <p class="text-center mb-2 text-slate-400">Already have an account?</p>
        <hr />
        <a [routerLink]="['/login']"><button type="button" class="btn mt-4 w-full">Login</button></a>
      </form>
      <div class="toast toast-top toast-end">
        <!-- <div class={showSecondToast ? "alert alert-success block" : "alert alert-success hidden"}>
          <span class="text-lg text-white p-1">Registration successful!</span>
        </div> -->
        <!-- <div class={showFirstToast ? "alert alert-error block" : "alert alert-error hidden"}>
          <span class="text-lg text-white p-1">An error occurred!</span>
        </div> -->
      </div>
    </div>
  `,
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
  constructor(private stateService: GlobalStateService, private router: Router) {}
  async submitApplication() {
    if (this.applyForm.value.name && this.applyForm.value.email && this.applyForm.value.pass) {
      const res = await this.authenticationService.userRegistration({ name: this.applyForm.value.name, email: this.applyForm.value.email, password: this.applyForm.value.pass });
      if (res.user_id) {
        localStorage.clear();
        localStorage.setItem('user_id', res.user_id);
        localStorage.setItem('name', res.name);
        localStorage.setItem('email', res.email);
        this.globalStateService.setUser(res);
        alert('registration successful!');
        this.router.navigate(['/']);
        // Reset the form fields after submission
        this.applyForm.reset();
      }
    } else {
      alert('All fields are required!!');
    }
  }
}
