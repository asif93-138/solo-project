import { Routes } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { DetailsComponent } from "./components/details/details.component";
import { MyMovieComponent } from "./pages/my-movie/my-movie.component";
import { CreateMovieComponent } from "./pages/create-movie/create-movie.component";
import { MUFormComponent } from "./pages/edit-movie/edit-movie.component";
import { authGuard } from "src/guards/auth.guard";

const routeConfig: Routes = [
  {
    path: "",
    component: HomeComponent,
    title: "Home Page",
  },
  {
    path: "login",
    component: LoginComponent,
    title: "Login Page",
  },
  {
    path: "register",
    component: RegisterComponent,
    title: "Register Page",
  },
  {
    path: "details/:id",
    component: DetailsComponent,
    title: "Details Page",
  },
  {
    path: "mymovie",
    component: MyMovieComponent,
    title: "My Movie",
    canActivate: [authGuard],
  },
  {
    path: "create",
    component: CreateMovieComponent,
    title: "Create Movie",
    canActivate: [authGuard],
  },
  {
    path: "edit/:id",
    component: MUFormComponent,
    title: "Edit Page",
    canActivate: [authGuard],
  },
];

export default routeConfig;
