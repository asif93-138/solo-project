import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from "@angular/core";
import { Router, RouterModule, ActivatedRoute, NavigationEnd } from "@angular/router";
import { GlobalStateService } from "./services/globalServices/global-state.service";
import { filter } from 'rxjs/operators';
import { User } from './interfaces/user';

@Component({
  standalone: true,
  selector: "app-root",
  template: `
    <!-- <main>
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
    </main> -->

    <nav *ngIf="authenticationRoute; else nonAuthTemplate" class="mt-16">
    <a [routerLink]="['/']" class="text-center"><div class="text-2xl font-bold text-primary hover:text-primary-focus transition-colors duration-300">
                            <span class="bg-yellow-500 text-white px-2 py-1 rounded">FILM</span>
                            <span class="text-black">Critic</span>
                        </div></a>
        </nav>

        <ng-template #nonAuthTemplate>
            <nav class="navbar bg-slate-900 text-neutral-content px-8">
            <div class="flex-1">
                            <a [routerLink]="['/']" class="m-2">      <div class="text-2xl font-bold text-primary hover:text-primary-focus transition-colors duration-300">
                                <span class="bg-yellow-500 text-black px-2 py-1 rounded">FILM</span>
                                <span class="text-white">Critic</span>
                            </div></a>
                        </div>
                        <div>
                        <div *ngIf="userExists; else loginTemplate" class="flex items-center gap-2">
                        <button type="button" style="height: fit-content;" class="btn bg-transparent btn-nav-l text-white min-h-0 py-3 rounded-full"><i class="fa-solid fa-plus"></i> New Movie</button>
                        <details class="dropdown dropdown-end">
                                        <summary tabIndex="0" class="btn p-0 btn-ghost tool-tip">
                                            <img style="height:auto;"
                                                alt="Tailwind CSS Navbar component"
                                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                                class="w-10 rounded-full border-2 border-yellow-500"
                                            />
                                            <small class="tooltiptext">{{userObj?.name}}<br />{{userObj?.email}}</small>
                                        </summary>
                                        <ul tabIndex="0" style="right:-15px;" class="menu mt-1 dropdown-content bg-base-100 rounded-box z-[1] w-32 shadow">
                                            <li class="text-black" *ngIf="homeRoute;">
                                            <a class="mb-1" [routerLink]="['/']" (click)="hideDropdown()" >Home</a>
                                            </li>
                                            <li class="text-black" *ngIf="userRoute;">
                                            <a class="mb-1" [routerLink]="['/mymovie']" (click)="hideDropdown()" >My List</a>
                                            </li>
                                            <li class="text-black"><button type="button" class="" (click)="logout()"><i class="fa-solid fa-right-from-bracket"></i> Logout</button></li>
                                        </ul>

                                    </details>
        </div>

        <ng-template #loginTemplate>
        <a [routerLink]="['/login']"><button class="btn bg-transparent btn-nav-l text-white min-h-0 h-auto py-3 rounded-full"><i class="fa-solid fa-right-to-bracket"></i> Login</button></a>
        </ng-template>
                        </div>
            </nav>
        </ng-template>
        <router-outlet></router-outlet>

  `,
  styleUrls: ["./app.component.css"],
  imports: [RouterModule, CommonModule],
})
export class AppComponent implements OnInit {
  userObj: User | null = null;
  userExists = false;
  authenticationRoute = false;
  homeRoute = true;
  userRoute = true;
  globalStateService = inject(GlobalStateService);
  router = inject(Router); // Inject Router service

  constructor(private stateService: GlobalStateService) {
    this.stateService.user$.subscribe((user) => {
      this.userObj = user;
      this.userExists = !!user;
    });
  }

  logout() {
    localStorage.clear();
    this.globalStateService.setUser(null);
    this.userExists = false;
  }

  hideDropdown() {
    document.getElementsByTagName("details")[0].removeAttribute("open")
  }

  ngOnInit() {
    // Subscribe to route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd)) // Filter for NavigationEnd events
      .subscribe((event: any) => {
        if (event.url == '/login' || event.url == '/register') {
          this.authenticationRoute = true;
        } else {
          this.authenticationRoute = false;
        }
        if (event.url == '/') {this.homeRoute = false;} else {this.homeRoute = true;}
        if (event.url == '/mymovie') {this.userRoute = false;} else {this.userRoute = true;}
      });
  }
}
