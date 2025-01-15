import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Genre } from "interfaces/genre";

@Injectable({
  providedIn: "root",
})
export class GenreService {
  constructor(private http: HttpClient) {}

  private apiUrl = "http://localhost:3000/api/genre/";
  getAllGenres(): Observable<Genre[]> {
    const res = this.http.get<Genre[]>(this.apiUrl);
    return res;
  }
  // async getAllGenres() {
  //   return await fetch("http://localhost:3000/api/genre/")
  //     .then((res) => res.json())
  //     .then((data) => data);
  // }

  async createNewGenre(data: any) {
    const response = await fetch("http://localhost:3000/api/genre/", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  }
}
