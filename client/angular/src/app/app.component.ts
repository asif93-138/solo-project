import { CommonModule } from '@angular/common';
import { Component, inject } from "@angular/core";
import { RouterModule } from "@angular/router";
import { GlobalStateService } from "./services/globalServices/global-state.service";

@Component({
  standalone: true,
  selector: "app-root",
  template: `
    <main>
      <header>
        <h1 class="text-3xl font-bold">
          <span class="me-10">Login status of user : {{userExists}}</span>
          <a [routerLink]="['/']"><button type="button" class="btn">Home</button></a>
        </h1>
        <div *ngIf="userExists; else loginTemplate">
      <p>Welcome back!</p>
      <button type="button" class="btn" (click)="logout()">Logout</button>
    </div>

    <ng-template #loginTemplate>
      <p>Please log in to continue.</p>
      <a [routerLink]="['/login']"><button type="button" class="btn">Login</button></a>
    </ng-template>

      </header>
      <section>
        <router-outlet></router-outlet>
      </section>
    </main>
  `,
  styleUrls: ["./app.component.css"],
  imports: [RouterModule, CommonModule],
})
export class AppComponent {
  userExists = false;
  globalStateService = inject(GlobalStateService);
  constructor(private stateService: GlobalStateService) {
    this.stateService.user$.subscribe((user) => {
      if (user) {
        this.userExists = true;
      }
    });
  }

  logout() {
    localStorage.clear();
    this.globalStateService.setUser(null);
    this.userExists = false;
  }
  
}
