import { Component, inject } from "@angular/core";
import { RouterModule } from "@angular/router";
import { UserService } from "./services/userServices/user.service";

@Component({
  standalone: true,
  selector: "app-root",
  template: `
    <main>
      <header>
        <h1 class="text-3xl font-bold">
          Login status of user : {{userExists}}
        </h1>
      </header>
      <section>
        <router-outlet></router-outlet>
      </section>
    </main>
  `,
  styleUrls: ["./app.component.css"],
  imports: [RouterModule],
})
export class AppComponent {
  authenticationService = inject(UserService);
  userExists = false;

  constructor() {
    this.userExists = this.authenticationService.checkLoggedInStatus();
  }
}
