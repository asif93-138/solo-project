import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <form class="border-2 p-6 rounded-lg w-2/5 mx-auto mt-4">
        <p class="text-2xl mb-4 font-medium">Register</p>
        <label for="name" class="font-medium">Name</label><br />
        <input type="text" id="name" name="name" class="border border-gray-400 rounded text-sm p-1 w-full" required /><br />
        <label for="email" class="font-medium">Email</label><br />
        <input type="email" id="email" name="email" class="border border-gray-400 rounded text-sm p-1 w-full" required /><br />
        <!-- {showUniqueEmailWarn && <p class="text-red-600">This email is already used!</p>} -->
        <label for="pass" class="font-medium">Password</label><br />
        <input type="password" id="pass" name="pass" class="border border-gray-400 rounded text-sm p-1 w-full" required /><br />
        <!-- <p id="passWarn" class={showPassWarn ? "text-red-600" : "text-red-600 hidden"}>Password must be at least 8 characters long!</p> -->
        <input type="submit" class="btn btn-warning my-4 w-full" value="Register" />
        <p class="text-center mb-2 text-slate-400">Already have an account?</p>
        <hr />
        <!-- <Link to='/login'><button type="button" class="btn mt-4 w-full">Login</button></Link> -->
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

}
