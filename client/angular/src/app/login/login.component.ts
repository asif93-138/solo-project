import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/userServices/user.service';
import { GlobalStateService } from '../services/globalServices/global-state.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="p-8">
      <form class="border-2 p-6 rounded-lg w-2/5 mx-auto mt-4" [formGroup]="applyForm" (submit)="submitApplication()">
        <p class="text-2xl mb-4 font-medium text-center">Log In</p>
        <label for="email" class="font-medium">Email</label><br />
        <input type="email" id="email" formControlName="email" class="border border-gray-400 rounded text-sm p-1 w-full" required /><br />
        <label for="pass" class="font-medium">Password</label><br />
        <input type="password" id="pass" formControlName="pass" class="border border-gray-400 rounded text-sm p-1 w-full" required /><br />
        <!-- <p class={showAlert_3? "text-center mt-2 text-red-500" : "text-center mt-2 text-red-500 hidden"}><b>Email or Password didn't match!</b></p> -->
        <!-- <p class={showAlert_2? "text-center mt-2 text-red-500" : "text-center mt-2 text-red-500 hidden"}><b>User isn't registered!</b></p> -->
        <input type="submit" class="btn btn-warning my-4 w-full" value="Login" />
        <p class="text-center mb-2 text-slate-400">New to movie review?</p>
        <hr />
        <a [routerLink]="['/register']"><button type="button" class="btn mt-4 w-full">Create your account</button></a>
      </form>
      <div class="toast toast-top toast-end">
  <!-- <div class={showAlert? "alert alert-success block" : "alert alert-success hidden"}>
    <span class="text-lg text-white p-1">Login successful!</span>
  </div>
</div> -->
    </div>
  `,
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
  constructor(private stateService: GlobalStateService) {
    this.stateService.user$.subscribe((user) => {
      if (user) {
        this.loggedInStatus = true;
      }
    });
  }
  async submitApplication() {
    const res = await this.authenticationService.userLogin(this.applyForm.value.email, this.applyForm.value.pass);
    if (res.user_id && res.password == this.applyForm.value.pass) {
      localStorage.clear();
      localStorage.setItem('user_id', res.user_id);
      localStorage.setItem('name', res.name);
      localStorage.setItem('email', res.email);
      this.globalStateService.setUser(res);
      alert('login successful!');
      // Reset the form fields after submission
      this.applyForm.reset();
    }
  }
}
