import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Genre } from "interfaces/genre";

@Injectable({
  providedIn: "root",
})
export class GenreService {
  constructor(private http: HttpClient) {}

  private apiUrl = "https://solo-project-llin.onrender.com/api/genre/";
  getAllGenres(): Observable<Genre[]> {
    const res = this.http.get<Genre[]>(this.apiUrl);
    return res;
  }
  // async getAllGenres() {
  //   return await fetch("https://solo-project-llin.onrender.com/api/genre/")
  //     .then((res) => res.json())
  //     .then((data) => data);
  // }

  createNewGenre(data: any): Observable<any> {
    return this.http.post("https://solo-project-llin.onrender.com/api/genre/", data);
  }
}
